let sqlite3 = require('sqlite3').verbose()
const DBSOURCE = 'schoolSystem.sqlite'
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
  }
})
db.run(`CREATE TABLE student (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
className TEXT NOT NULL,
contactNumber INTEGER NOT NULL
)`,
  (err) => {
    if (err) {
      console.log('Issue in SQLite Table creation.', err)
    }
  });
db.run(`CREATE TABLE classDetails (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
location TEXT NOT NULL,
classTeacher INTEGER NOT NULL
)`,
  (err) => {
    if (err) {
      console.log('Issue in SQLite Table creation.', err)
    }
  });