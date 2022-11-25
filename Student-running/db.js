var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    db.run(`CREATE TABLE student (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          contactNumber	TEXT NOT NULL,
          className	TEXT NOT NULL
        )`,
      (err) => {
        if (err) {
          console.log('Issue in SQLite Table creation.', err)
        }
      });
  }
});
console.log(db)
module.exports = db