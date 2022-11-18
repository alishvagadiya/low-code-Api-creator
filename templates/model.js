function createGetDbFunction(moduleName, functionName, tableName, fieldNameList) {
  return 'const ' + functionName + ' = (request, response) => {' + EOL +
    '    const sql = "select ' + fieldNameList + ' from ' + tableName + '"' + EOL +
    '      const params = []' + EOL +
    '      db.all(sql, params, (err, rows) => {' + EOL +
    '          if (err) {' + EOL +
    '            response.status(400).json({"error":"[' + moduleName + '.' + functionName + ']"+err.message});' + EOL +
    '            return;' + EOL +
    '          }' + EOL +
    '          response.status(200).json({' + EOL +
    '              "message":"success",' + EOL +
    '              "data":rows' + EOL +
    '          })' + EOL +
    '        });' + EOL +
    '  }' + EOL
}
function createGetByIdDbFunction(moduleName, functionName, tableName, fieldNameList) {
  return 'const ' + functionName + ' = (request, response) => {' + EOL +
    '  const id = parseInt(request.params.id)' + EOL +
    '  var sql = "select ' + fieldNameList + ' from ' + moduleName + ' where id = ?"' + EOL +
    '  var params = [id]' + EOL +
    '  db.get(sql, params, (err, row) => {' + EOL +
    '      if (err) {' + EOL +
    '        response.status(400).json({"error":"[' + moduleName + '.' + functionName + ']"+err.message});' + EOL +
    '        return;' + EOL +
    '      }' + EOL +
    '      response.json({' + EOL +
    '          "message":"success",' + EOL +
    '          "data":row' + EOL +
    '      })' + EOL +
    '    });' + EOL +
    '}' + EOL
}

function createAddDbFunction(moduleName, functionName, tableName, fieldNameList, validationBody) {
  return 'const ' + functionName + ' = (request, response) => {' + EOL +
    '  const { ' + fieldNameList + ' } = request.body' + EOL +
    '  const errors=[]' + EOL +
    validationBody + EOL +
    '  if (errors.length){' + EOL +
    '      res.status(400).json({"error":errors.join(",")});' + EOL +
    '      return;' + EOL +
    '  }' + EOL +
    '  var sql ="INSERT INTO ' + tableName + ' (' + fieldNameList + ') VALUES (?,?,?)"' + EOL +
    '  var params =[' + fieldNameList + ']' + EOL +
    '  db.run(sql, params, function (err, result) {' + EOL +
    '      if (err){' + EOL +
    '          response.status(400).json({"error":"[' + moduleName + '.' + functionName + ']"+err.message})' + EOL +
    '          return;' + EOL +
    '      }' + EOL +
    '      response.json({' + EOL +
    '          "message": "success",' + EOL +
    '          "dataId" : this.lastID' + EOL +
    '      })' + EOL +
    '  });' + EOL +
    '}' + EOL
}

function createUpdateDbFunction(moduleName, functionName, tableName, fieldNameList, tableDetails) {
  const updateQuery = []
  for (let index in tableDetails) {
    let field = tableDetails[index]
    updateQuery[index] = '        ' + field['fieldName'] + ' = COALESCE(?,' + field['fieldName'] + ')'
  }
  const updateQueryBody = updateQuery.join(',' + EOL)
  return 'const ' + functionName + ' = (request, response) => {' + EOL +
    '  const id = parseInt(request.params.id)' + EOL +
    '  const { ' + fieldNameList + ' } = request.body' + EOL +
    '  db.run(' + EOL +
    '      `UPDATE ' + tableName + ' set ' + EOL +
    updateQueryBody + EOL +
    '        WHERE id = ?`,' + EOL +
    '      [' + fieldNameList + ', id],' + EOL +
    '      (err, result) => {' + EOL +
    '          if (err){' + EOL +
    '              response.status(400).json({"error":"[' + moduleName + '.' + functionName + ']"+err.message})' + EOL +
    '              return;' + EOL +
    '          }' + EOL +
    '          response.json({' + EOL +
    '              message: "success",' + EOL +
    '          })' + EOL +
    '  });' + EOL +
    '}' + EOL
}

function createDeleteDbFunction(moduleName, functionName, tableName) {
  return 'const ' + functionName + ' = (request, response) => {' + EOL +
    '  const id = parseInt(request.params.id)' + EOL +
    '' + EOL +
    '  db.run(' + EOL +
    '    "DELETE FROM ' + tableName + ' WHERE id = ?",id,' + EOL +
    '    function (err, result) {' + EOL +
    '        if (err){' + EOL +
    '            response.status(400).json({"error":"[' + moduleName + '.' + functionName + ']"+err.message})' + EOL +
    '            return;' + EOL +
    '        }' + EOL +
    '        response.json({"message":"deleted", rows: this.changes})' + EOL +
    '  });' + EOL +
    '}' + EOL
}
function createModelFile(dbFunction) {
  let modelBody = '';
  modelBody += 'const sqlite3 = require("sqlite3").verbose()' + EOL +
    'const DBSOURCE = "db.sqlite"' + EOL +
    '' + EOL +
    'let db = new sqlite3.Database(DBSOURCE, (err) => {' + EOL +
    '  if (err) {' + EOL +
    '    console.error(err.message)' + EOL +
    '    throw err' + EOL +
    '  }else{' + EOL +
    '    console.log("Connected to the SQLite database.")' + EOL +
    '  }' + EOL +
    '});' + EOL

  for (let index in dbFunction) {
    let field = dbFunction[index]
    modelBody += field + EOL
  }
  return (modelBody);
}

module.exports = { createGetDbFunction, createGetByIdDbFunction, createAddDbFunction, createUpdateDbFunction, createDeleteDbFunction, createModelFile }