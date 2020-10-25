const express = require('express')
const app = express()
const { Client } = require('pg')
const port = process.env.PORT || 8000

// https redirect
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

// make sure production uses ssl (or else it crashes), in case I forget to uncomment it after disabling it for local use
if (process.env.NODE_ENV === 'production') {
	// allows node to connect to heroku postgres database with ssl (they have a self-signed certificate that we have to accept)
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	// config for connecting to database
	const client = new Client({
		connectionString: process.env.DATABASE_URL + '?sslmode=require',
		ssl: {
			rejectUnauthorized: false
		}
	});
}

// connect to database
client.connect(err => {
	if (err) {
    console.error('Connection error', err.stack)
  } else {
    console.log('Connected')
  }
})

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/new-signup')
})

app.get('/new-signup', (req, res) => {
	res.sendFile( __dirname + '/linux-club-signup.html')
})

app.use('/new-signup', express.urlencoded())

// when a user submits the form, save the data to database
app.post('/new-signup', (req, res) => {
	const { name, email, used, experience, distro, otherDistro, available } = req.body;

	// only use text from 'otherDistro' if 'other' was selected for distro 
	otherDistro2=""
	if (distro == "other") 
		otherDistro2=otherDistro

	let info = [name, email, used, experience, distro, otherDistro2, available];

	// if form is empty, refresh page
	let empty = true;
	for (let i=0; i<info.length; i++) {
		if (info[i]) {
			empty = false;
			break;
		}
	}

	if (empty) {
		res.redirect('/new-signup');
	} else {
		client.query('INSERT INTO signups (name,email,used,experience,distro,otherDistro,available) VALUES ($1,$2,$3,$4,$5,$6,$7);', info, (err, res) => {
			if (err) {
				console.log('Error in database')
				console.log(err.stack)
			} else {
				//console.log('successful signup')
			}
		})

		res.redirect('/success');
	}
})

app.get('/success', (req, res) => {
	res.sendFile( __dirname + '/success.html')
})

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`)
})
