const sqlite3 = require("sqlite3").verbose()
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    // TODO: remove log
  }
});
const getStudent = (request, response) => {
  const sql = "select name,className,contactNumber from student"
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      response.status(400).json({ "error": "[Student.getStudent]" + err.message });
      return;
    }
    response.status(200).json({
      "message": "success",
      "data": rows
    })
  });
}

const getStudentById = (request, response) => {
  const id = parseInt(request.params.id)
  var sql = "select name,className,contactNumber from Student where id = ?"
  var params = [id]
  db.get(sql, params, (err, row) => {
    if (err) {
      response.status(400).json({ "error": "[Student.getStudentById]" + err.message });
      return;
    }
    response.json({
      "message": "success",
      "data": row
    })
  });
}

const createStudent = (request, response) => {
  const { name, className, contactNumber } = request.body
  const errors = []
  if ((typeof name) == String) {
    errors.push("name contains not valid data");
  }

  if ((typeof className) == String) {
    errors.push("className contains not valid data");
  }

  if ((typeof contactNumber) == Number) {
    errors.push("contactNumber contains not valid data");
  }

  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  var sql = "INSERT INTO student (name,className,contactNumber) VALUES (?,?,?)"
  var params = [name, className, contactNumber]
  db.run(sql, params, function (err, result) {
    if (err) {
      response.status(400).json({ "error": "[Student.createStudent]" + err.message })
      return;
    }
    response.json({
      "message": "success",
      "dataId": this.lastID
    })
  });
}

const updateStudent = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, className, contactNumber } = request.body
  db.run(
    `UPDATE student set 
        name = COALESCE(?,name),
        className = COALESCE(?,className),
        contactNumber = COALESCE(?,contactNumber)
        WHERE id = ?`,
    [name, className, contactNumber, id],
    (err, result) => {
      if (err) {
        response.status(400).json({ "error": "[Student.updateStudent]" + err.message })
        return;
      }
      response.json({
        message: "success",
      })
    });
}

const deleteStudent = (request, response) => {
  const id = parseInt(request.params.id)

  db.run(
    "DELETE FROM student WHERE id = ?", id,
    function (err, result) {
      if (err) {
        response.status(400).json({ "error": "[Student.deleteStudent]" + err.message })
        return;
      }
      response.json({ "message": "deleted", rows: this.changes })
    });
}

module.exports = {
  getStudent, getStudentById, createStudent, updateStudent, deleteStudent
}
