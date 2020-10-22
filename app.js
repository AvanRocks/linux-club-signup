const express = require('express')
const app = express()

const port = process.env.PORT || 8000

const { Client } = require('pg')

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
    rejectUnauthorized: false
  }
});

client.connect(err => {
	if (err) {
    console.error('Connection error', err.stack)
  } else {
    console.log('Connected')
  }
})

app.get('/', (req, res) => {
  res.redirect('/new-signup')
})

app.get('/new-signup', (req, res) => {
	res.sendFile( __dirname + '/linux-club-signup.html')
})

app.use('/new-signup', express.urlencoded())

app.post('/new-signup', (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	client.query('INSERT INTO info (name, email) VALUES ($1, $2);', [name, email], (err, res) => {
		if (err) {
			console.log('Error in database')
			console.log(err.stack)
		} else {
			console.log('successful signup')
		}
	})

	res.redirect('/success');
})

app.get('/success', (req, res) => {
	res.sendFile( __dirname + '/success.html')
})

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`)
})
