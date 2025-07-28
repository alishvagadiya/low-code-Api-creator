const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./db')
const model = require('./model')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and sqlite API' })
})

app.get('/Student', model.getStudent)
app.get('/Student/:id', model.getStudentById)
app.post('/Student', model.createStudent)
app.put('/Student/:id', model.updateStudent)
app.delete('/Student/:id', model.deleteStudent)

app.listen(port, () => {
  // TODO: remove log
})