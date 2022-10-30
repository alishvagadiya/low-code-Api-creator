// const tableDetails = require('s')
// const fs = require('fs')
// import { json } from 'body-parser';
import fs from 'fs'
import os from 'os'
const {EOL} = os;

let configJson = readJson('./signup.json');
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

dbFunction['get'] = createGetDbFunction(moduleName,functionName['get'],tableName,fieldNameList,)
dbFunction['getById'] =createGetByIdDbFunction(moduleName,functionName['getById'],tableName,fieldNameList)
dbFunction['add'] =createAddDbFunction(moduleName,functionName['post'],tableName,fieldNameList,tableToValidation(tableDetails))
dbFunction['update'] =createUpdateDbFunction(moduleName,functionName['put'],tableName,fieldNameList,tableDetails)
dbFunction['delete'] =createDeleteDbFunction(moduleName,functionName['delete'],tableName)
dbFunction['postFix'] = dbPostFix(functionName);

function readJson(filePath) {
  const rawJson = fs.readFileSync(filePath);
  const jsonObject = JSON.parse(rawJson);
  return jsonObject
}
const modelBody = createModelFile(dbFunction);
const routeBody = createRoutesFile(defineRoutes(moduleName));

function writeFile(fileName,fileBody) {
  fs.appendFile(fileName, fileBody, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

writeFile('model.js',modelBody)
writeFile('route.js',routeBody)
function defineFunction(moduleName){
  let functionName = []
  functionName['get'] = "get"+moduleName;
  functionName['getById'] = "get"+moduleName+"ById";
  functionName['post'] = "create"+moduleName;
  functionName['put'] = "update"+moduleName;
  functionName['delete'] = "delete"+moduleName;
  return functionName;
}

function defineRoutes(moduleName) {
  let functionRoute = []
  functionRoute['get'] = "app.get('/"+moduleName+"', model."+functionName['get']+")";
  functionRoute['getById'] = "app.get('/"+moduleName+"/:id', model."+functionName['getById']+")";
  functionRoute['post'] = "app.post('/"+moduleName+"', model."+functionName['post']+")";
  functionRoute['put'] = "app.put('/"+moduleName+"', model."+functionName['put']+")";
  functionRoute['delete'] = "app.delete('/"+moduleName+"', model."+functionName['delete']+")";
  return functionRoute;
}

function tableToValidation(tableDetails) {
  let validationBody = [];
  for (let index in tableDetails) {
    let field = tableDetails[index]
    validationBody[index] = '  if ((typeof '+field['fieldName']+') == '+field['fieldType']+'){'+EOL+
    '      errors.push("'+field['fieldName']+' contains not valid data");'+EOL+
    '  }'+EOL
  }
  return validationBody.join(EOL)
}

function createGetDbFunction(moduleName,functionName,tableName,fieldNameList) {
  return 'const '+functionName+' = (request, response) => {'+EOL+
  '    const sql = "select '+fieldNameList+' from '+tableName+'"'+EOL+
  '      const params = []'+EOL+
  '      db.all(sql, params, (err, rows) => {'+EOL+
  '          if (err) {'+EOL+
  '            response.status(400).json({"error":"['+moduleName+'.'+functionName+']"+err.message});'+EOL+
  '            return;'+EOL+
  '          }'+EOL+
  '          response.status(200).json({'+EOL+
  '              "message":"success",'+EOL+
  '              "data":rows'+EOL+
  '          })'+EOL+
  '        });'+EOL+
  '  }'+EOL
}
function createGetByIdDbFunction(moduleName,functionName,tableName,fieldNameList) {
  return 'const '+functionName+' = (request, response) => {'+EOL+
  '  const id = parseInt(request.params.id)'+EOL+
  '  var sql = "select '+fieldNameList+' from '+moduleName+' where id = ?"'+EOL+
  '  var params = [id]'+EOL+
  '  db.get(sql, params, (err, row) => {'+EOL+
  '      if (err) {'+EOL+
  '        response.status(400).json({"error":"['+moduleName+'.'+functionName+']"+err.message});'+EOL+
  '        return;'+EOL+
  '      }'+EOL+
  '      response.json({'+EOL+
  '          "message":"success",'+EOL+
  '          "data":row'+EOL+
  '      })'+EOL+
  '    });'+EOL+
  '}'+EOL
}

function createAddDbFunction(moduleName,functionName,tableName,fieldNameList,validationBody) {
  return 'const '+functionName+' = (request, response) => {'+EOL+
    '  const { '+fieldNameList+' } = request.body'+EOL+
    '  const errors=[]'+EOL+
    validationBody+EOL+
    '  if (errors.length){'+EOL+
    '      res.status(400).json({"error":errors.join(",")});'+EOL+
    '      return;'+EOL+
    '  }'+EOL+
    '  var sql ="INSERT INTO '+tableName+' ('+fieldNameList+') VALUES (?,?,?)"'+EOL+
    '  var params =['+fieldNameList+']'+EOL+
    '  db.run(sql, params, function (err, result) {'+EOL+
    '      if (err){'+EOL+
    '          response.status(400).json({"error":"['+moduleName+'.'+functionName+']"+err.message})'+EOL+
    '          return;'+EOL+
    '      }'+EOL+
    '      response.json({'+EOL+
    '          "message": "success",'+EOL+
    '          "data": data,'+EOL+
    '          "id" : this.lastID'+EOL+
    '      })'+EOL+
    '  });'+EOL+
    '}'+EOL
}

function createUpdateDbFunction(moduleName,functionName,tableName,fieldNameList,tableDetails){
  const updateQuery = []
  for (let index in tableDetails) {
    let field = tableDetails[index]
    updateQuery[index] = '        '+field['fieldName']+' = COALESCE(?,'+field['fieldName']+')'
  }
  const updateQueryBody = updateQuery.join(','+EOL)
  return 'const '+functionName+' = (request, response) => {'+EOL+
  '  const id = parseInt(request.params.id)'+EOL+
  '  const { '+fieldNameList+' } = request.body'+EOL+
  '  db.run('+EOL+
  '      `UPDATE '+tableName+' set '+EOL+
  updateQueryBody+EOL+
  '        WHERE id = ?`,'+EOL+
  '      ['+fieldNameList+', id],'+EOL+
  '      (err, result) => {'+EOL+
  '          if (err){'+EOL+
  '              response.status(400).json({"error":"['+moduleName+'.'+functionName+']"+err.message})'+EOL+
  '              return;'+EOL+
  '          }'+EOL+
  '          response.json({'+EOL+
  '              message: "success",'+EOL+
  '              data: data'+EOL+
  '          })'+EOL+
  '  });'+EOL+
  '}'+EOL
}

function createDeleteDbFunction(moduleName,functionName,tableName){
  return 'const '+functionName+' = (request, response) => {'+EOL+
  '  const id = parseInt(request.params.id)'+EOL+
  ''+EOL+
  '  db.run('+EOL+
  '    "DELETE FROM '+tableName+' WHERE id = ?",id,'+EOL+
  '    function (err, result) {'+EOL+
  '        if (err){'+EOL+
  '            response.status(400).json({"error":"['+moduleName+'.'+functionName+']"+err.message})'+EOL+
  '            return;'+EOL+
  '        }'+EOL+
  '        response.json({"message":"deleted", rows: this.changes})'+EOL+
  '  });'+EOL+
  '}'+EOL
}

function dbPostFix(functionName) {
  let funName = ''
  for (let index in functionName) {
    let field = functionName[index]
    funName += field + ', '
  }
  let functionNameToStr = funName.substring(0, funName.length-2)
  console.log(funName)
  // let functionNameToStr = funName.join(',');
  return 'module.exports = {'+EOL+'  '+functionNameToStr+EOL + '}'
}

function createModelFile(dbFunction) {
  let modelBody = '';
  modelBody += 'const sqlite3 = require("sqlite3").verbose()'+EOL+
  'const DBSOURCE = "db.sqlite"'+EOL+
  ''+EOL+
  'let db = new sqlite3.Database(DBSOURCE, (err) => {'+EOL+
  '  if (err) {'+EOL+
  '    console.error(err.message)'+EOL+
  '    throw err'+EOL+
  '  }else{'+EOL+
  '    console.log("Connected to the SQLite database.")'+EOL+
  '  }'+EOL+
  '});'+EOL

  for (let index in dbFunction) {
    let field = dbFunction[index]
    modelBody += field + EOL
  }
  return(modelBody);
}
function createRoutesFile(routeList) {
  let arrToStr = ''
  for (let index in routeList) {
    let route = routeList[index]
    arrToStr += route + EOL
  }
  let routeBody = "const express = require('express')"+EOL+
  "const bodyParser = require('body-parser')"+EOL+
  "const app = express()"+EOL+
  "const db = require('./db')"+EOL+
  "const model = require('./model')"+EOL+
  "const port = 3000"+EOL+
  ""+EOL+
  "app.use(bodyParser.json())"+EOL+
  "app.use("+EOL+
  "  bodyParser.urlencoded({"+EOL+
  "    extended: true,"+EOL+
  "  })"+EOL+
  ")"+EOL+
  ""+EOL+
  "app.get('/', (request, response) => {"+EOL+
  "  response.json({ info: 'Node.js, Express, and sqlite API' })"+EOL+
  "})"+EOL+EOL+
  arrToStr+EOL+
  "app.listen(port, () => {"+EOL+
  "  console.log(`App running on port ${port}.`)"+EOL+
  "})"
  return(routeBody);
}