const { EOL } = require('os')

function createDbFile(dbName, tables) {
  let sqlTableQuery = '';
  for (let tableName in tables) {
    let tableBody = tables[tableName]
    sqlTableQuery += "db.run(`CREATE TABLE " + tableName + " (" + EOL +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," + EOL +
      tableBody + EOL +
      ")`," + EOL +
      "  (err) => {" + EOL +
      "    if (err) {" + EOL +
      "      console.log('Issue in SQLite Table creation.', err)" + EOL +
      "    }" + EOL +
      "  });" + EOL
  }
  let tableBody = "let sqlite3 = require('sqlite3').verbose()" + EOL +
    "const DBSOURCE = '" + dbName + ".sqlite'" + EOL +
    "let db = new sqlite3.Database(DBSOURCE, (err) => {" + EOL +
    "  if (err) {" + EOL +
    "    console.error(err.message)" + EOL +
    "    throw err" + EOL +
    "  } else {" + EOL +
    "    console.log('Connected to the SQLite database.')" + EOL +
    "  }" +
    "})" + EOL
  tableBody += sqlTableQuery
  tableBody += "module.exports = db" + EOL;
  return tableBody
}

module.exports = { createDbFile }