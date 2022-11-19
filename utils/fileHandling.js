const fs = require('fs')
const path = require('path')
function readJson(filePath) {
  const rawJson = fs.readFileSync(filePath);
  const jsonObject = JSON.parse(rawJson);
  return jsonObject
}

function writeFile(filePath, fileBody) {
  console.log(ensureDirectoryExist(filePath), filePath)
  if (!ensureDirectoryExist(filePath)) {
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


function ensureDirectoryExist(filePath) {
  let dirname = path.dirname(filePath);
  console.log(dirname)
  console.log(fs.existsSync(dirname))
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExist(dirname);
  fs.mkdirSync(dirname);
}

module.exports = { readJson, writeFile, ensureDirectoryExist }