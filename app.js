const express = require('express')
const app = express()
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/new-signup', (req, res) => {

})

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`)
})
