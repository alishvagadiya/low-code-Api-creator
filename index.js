const fs = require('fs')
const path = require('path')
const os = require('os')
const { EOL } = os;

const { createGetDbFunction, createGetByIdDbFunction, createAddDbFunction, createUpdateDbFunction, createDeleteDbFunction, createModelFile } = require('./templates/model')

const { createGetDbFunction, createGetByIdDbFunction, createAddDbFunction, createUpdateDbFunction, createDeleteDbFunction, createModelFile } = require('./templates/route')

let configJson = readJson('./config.json');
let moduleName = configJson.moduleName;
let tableName = configJson.tableName;
let tableDetails = configJson.tableDetails;
let fieldNameList = [];
let dbFunction = [];
for (let index in tableDetails) {
  let field = tableDetails[index]
  fieldNameList[index] = field['fieldName']
}
const functionName = defineFunction(moduleName)

dbFunction['get'] = createGetDbFunction(moduleName, functionName['get'], tableName, fieldNameList,)
dbFunction['getById'] = createGetByIdDbFunction(moduleName, functionName['getById'], tableName, fieldNameList)
dbFunction['add'] = createAddDbFunction(moduleName, functionName['post'], tableName, fieldNameList, tableToValidation(tableDetails))
dbFunction['update'] = createUpdateDbFunction(moduleName, functionName['put'], tableName, fieldNameList, tableDetails)
dbFunction['delete'] = createDeleteDbFunction(moduleName, functionName['delete'], tableName)
dbFunction['postFix'] = dbPostFix(functionName);

function readJson(filePath) {
  const rawJson = fs.readFileSync(filePath);
  const jsonObject = JSON.parse(rawJson);
  return jsonObject
}
const modelBody = createModelFile(dbFunction);
const routeBody = createRoutesFile(defineRoutes(moduleName));

// var dir = './tmp/but/then/nested';

function writeFile(filePath, fileBody) {
  console.log(ensureDirectoryExistence(filePath), filePath)
  if (!ensureDirectoryExistence(filePath)) {
    console.log('folder is not exists')
    return;
  }

  fs.appendFile(filePath, fileBody, function (err) {
    if (err) {
      console.log(err)
      throw err
    };
    console.log('Saved!');
  });
}


function ensureDirectoryExistence(filePath) {
  let dirname = path.dirname(filePath);
  console.log(dirname)
  console.log(fs.existsSync(dirname))
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

writeFile(moduleName + '/' + 'model.js', modelBody)
writeFile(moduleName + '/' + 'route.js', routeBody)
function defineFunction(moduleName) {
  let functionName = []
  functionName['get'] = "get" + moduleName;
  functionName['getById'] = "get" + moduleName + "ById";
  functionName['post'] = "create" + moduleName;
  functionName['put'] = "update" + moduleName;
  functionName['delete'] = "delete" + moduleName;
  return functionName;
}

function tableToValidation(tableDetails) {
  let validationBody = [];
  for (let index in tableDetails) {
    let field = tableDetails[index]
    validationBody[index] = '  if ((typeof ' + field['fieldName'] + ') == ' + field['fieldType'] + '){' + EOL +
      '      errors.push("' + field['fieldName'] + ' contains not valid data");' + EOL +
      '  }' + EOL
  }
  return validationBody.join(EOL)
}

function dbPostFix(functionName) {
  let funName = ''
  for (let index in functionName) {
    let field = functionName[index]
    funName += field + ', '
  }
  let functionNameToStr = funName.substring(0, funName.length - 2)
  console.log(funName)
  // let functionNameToStr = funName.join(',');
  return 'module.exports = {' + EOL + '  ' + functionNameToStr + EOL + '}'
}