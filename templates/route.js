function createRoutesFile(routeList) {
  let arrToStr = ''
  for (let index in routeList) {
    let route = routeList[index]
    arrToStr += route + EOL
  }
  let routeBody = "const express = require('express')" + EOL +
    "const bodyParser = require('body-parser')" + EOL +
    "const app = express()" + EOL +
    "const db = require('./db')" + EOL +
    "const model = require('./model')" + EOL +
    "const port = 3000" + EOL +
    "" + EOL +
    "app.use(bodyParser.json())" + EOL +
    "app.use(" + EOL +
    "  bodyParser.urlencoded({" + EOL +
    "    extended: true," + EOL +
    "  })" + EOL +
    ")" + EOL +
    "" + EOL +
    "app.get('/', (request, response) => {" + EOL +
    "  response.json({ info: 'Node.js, Express, and sqlite API' })" + EOL +
    "})" + EOL + EOL +
    arrToStr + EOL +
    "app.listen(port, () => {" + EOL +
    "  console.log(`App running on port ${port}.`)" + EOL +
    "})"
  return (routeBody);
}

function defineRoutes(moduleName) {
  let functionRoute = []
  functionRoute['get'] = "app.get('/" + moduleName + "', model." + functionName['get'] + ")";
  functionRoute['getById'] = "app.get('/" + moduleName + "/:id', model." + functionName['getById'] + ")";
  functionRoute['post'] = "app.post('/" + moduleName + "', model." + functionName['post'] + ")";
  functionRoute['put'] = "app.put('/" + moduleName + "/:id', model." + functionName['put'] + ")";
  functionRoute['delete'] = "app.delete('/" + moduleName + "/:id', model." + functionName['delete'] + ")";
  return functionRoute;
}

module.exports = { createRoutesFile, defineRoutes }