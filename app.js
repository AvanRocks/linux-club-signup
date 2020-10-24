const express = require('express')
const app = express()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = process.env.PORT || 8000

const { Client } = require('pg')

const client = new Client({
	connectionString: process.env.DATABASE_URL + '?sslmode=require',
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

console.log(process.env.NODE_ENV)

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/new-signup')
})

app.get('/new-signup', (req, res) => {
	res.sendFile( __dirname + '/linux-club-signup.html')
})

app.use('/new-signup', express.urlencoded())

app.post('/new-signup', (req, res) => {
	const { name, email, used, experience, distro, otherDistro, available } = req.body;

	otherDistro2=""
	if (distro == "other") 
		otherDistro2=otherDistroa

	client.query('INSERT INTO signups (name,email,used,experience,distro,otherDistro,available) VALUES ($1,$2,$3,$4,$5,$6,$7);', [name,email,used,experience,distro,otherDistro2,available], (err, res) => {
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
