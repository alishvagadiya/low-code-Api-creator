let sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "student.sqlite"
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    db.run(`CREATE TABLE student (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          contactNumber	TEXT NOT NULL,
          classNumber	TEXT NOT NULL
        )`,
      (err) => {
        if (err) {
          console.log('Issue in SQLite Table creation.', err)
        }
      });
  }
});

module.exports = db