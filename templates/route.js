const { EOL } = require('os')

function createRoutesFile(moduleName, functionName) {
  let routeBody = buildHeader();
  routeBody += defineRoutes(moduleName, functionName) + EOL
  routeBody += buildFooter();
  return (routeBody);
}
function buildHeader() {
  let routeHeader = "const express = require('express')" + EOL +
    "const bodyParser = require('body-parser')" + EOL +
    "const app = express()" + EOL +
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
    "})" + EOL + EOL
  return routeHeader;
}
function defineRoutes(moduleName, functionName) {
  let functionRoute = [];
  let routeBody = '';
  let endPointName = moduleName.toLowerCase()
  functionRoute['get'] = "app.get('/" + endPointName + "', model." + functionName['get'] + ")";
  functionRoute['getById'] = "app.get('/" + endPointName + "/:id', model." + functionName['getById'] + ")";
  functionRoute['post'] = "app.post('/" + endPointName + "', model." + functionName['post'] + ")";
  functionRoute['put'] = "app.put('/" + endPointName + "/:id', model." + functionName['put'] + ")";
  functionRoute['delete'] = "app.delete('/" + endPointName + "/:id', model." + functionName['delete'] + ")";

  for (let index in functionRoute) {
    let route = functionRoute[index]
    routeBody += route + EOL
  }
  return routeBody;
}

function buildFooter() {
  let routeFooter = "app.listen(port, () => {" + EOL +
    "  console.log(`App running on port ${port}.`)" + EOL +
    "})";
  return routeFooter;
}

module.exports = { createRoutesFile }