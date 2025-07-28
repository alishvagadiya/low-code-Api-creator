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

app.get('/ClassDetails', model.getClassDetails)
app.get('/ClassDetails/:id', model.getClassDetailsById)
app.post('/ClassDetails', model.createClassDetails)
app.put('/ClassDetails/:id', model.updateClassDetails)
app.delete('/ClassDetails/:id', model.deleteClassDetails)

app.listen(port, () => {
  // TODO: remove log
})