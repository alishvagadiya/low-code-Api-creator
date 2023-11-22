const sqlite3 = require("sqlite3").verbose()
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log("Connected to the SQLite database.")
  }
});
const getClassDetails = (request, response) => {
  const sql = "select name,location,classTeacher from classDetails"
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      response.status(400).json({ "error": "[ClassDetails.getClassDetails]" + err.message });
      return;
    }
    response.status(200).json({
      "message": "success",
      "data": rows
    })
  });
}

const getClassDetailsById = (request, response) => {
  const id = parseInt(request.params.id)
  var sql = "select name,location,classTeacher from classDetails where id = ?"
  var params = [id]
  db.get(sql, params, (err, row) => {
    if (err) {
      response.status(400).json({ "error": "[ClassDetails.getClassDetailsById]" + err.message });
      return;
    }
    response.json({
      "message": "success",
      "data": row
    })
  });
}

const createClassDetails = (request, response) => {
  const { name, location, classTeacher } = request.body
  const errors = []
  if ((typeof name) == TEXT) {
    errors.push("name contains not valid data");
  }

  if ((typeof location) == TEXT) {
    errors.push("location contains not valid data");
  }

  if ((typeof classTeacher) == INTEGER) {
    errors.push("classTeacher contains not valid data");
  }

  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  var sql = "INSERT INTO classDetails (name,location,classTeacher) VALUES (?,?,?)"
  var params = [name, location, classTeacher]
  db.run(sql, params, function (err, result) {
    if (err) {
      response.status(400).json({ "error": "[ClassDetails.createClassDetails]" + err.message })
      return;
    }
    response.json({
      "message": "success",
      "dataId": this.lastID
    })
  });
}

const updateClassDetails = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, location, classTeacher } = request.body
  db.run(
    `UPDATE classDetails set 
        name = COALESCE(?,name),
        location = COALESCE(?,location),
        classTeacher = COALESCE(?,classTeacher)
        WHERE id = ?`,
    [name, location, classTeacher, id],
    (err, result) => {
      if (err) {
        response.status(400).json({ "error": "[ClassDetails.updateClassDetails]" + err.message })
        return;
      }
      response.json({
        message: "success",
      })
    });
}

const deleteClassDetails = (request, response) => {
  const id = parseInt(request.params.id)

  db.run(
    "DELETE FROM classDetails WHERE id = ?", id,
    function (err, result) {
      if (err) {
        response.status(400).json({ "error": "[ClassDetails.deleteClassDetails]" + err.message })
        return;
      }
      response.json({ "message": "deleted", rows: this.changes })
    });
}

module.exports = {
  getClassDetails, getClassDetailsById, createClassDetails, updateClassDetails, deleteClassDetails
}
