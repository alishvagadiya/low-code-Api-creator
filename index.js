const { EOL } = require('os')

const { createModelFile } = require('./templates/model')

const { createRoutesFile, defineRoutes } = require('./templates/route')
const { createDbFile } = require('./templates/db')
const { readJson, writeFile } = require('./utils/fileHandling')

let configJson = readJson('./config.json');
let dbName = configJson.dbName;
let modules = configJson.modules;
let tables = [];
for (const key in modules) {
  let module = modules[key];
  let moduleName = module.moduleName;
  let tableName = module.tableName;
  let tableDetails = module.tableDetails;
  let fieldNameList = [];
  let tblObjToTblBody = []
  for (let index in tableDetails) {
    let field = tableDetails[index]
    fieldNameList[index] = field['fieldName'];
    tblObjToTblBody.push(field['fieldName'] + ' ' + field['fieldType'] + ' NOT NULL')
  }
  tables[tableName] = tblObjToTblBody.join(',' + EOL);
  const functionName = defineFunction(moduleName)
  const modelBody = createModelFile(moduleName, functionName, tableName, fieldNameList, tableDetails);
  const routeBody = createRoutesFile(moduleName, functionName);
  writeFile('src/' + moduleName + '/' + 'model.js', modelBody)
  writeFile('src/' + moduleName + '/' + 'route.js', routeBody)
}
const dbBody = createDbFile(dbName, tables);
writeFile('src/' + 'sqlScript.js', dbBody)
function defineFunction(moduleName) {
  let functionName = []
  functionName['get'] = "get" + moduleName;
  functionName['getById'] = "get" + moduleName + "ById";
  functionName['post'] = "create" + moduleName;
  functionName['put'] = "update" + moduleName;
  functionName['delete'] = "delete" + moduleName;
  return functionName;
}
