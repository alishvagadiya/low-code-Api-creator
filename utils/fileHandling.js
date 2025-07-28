const fs = require('fs')
const path = require('path')
function readJson(filePath) {
  const rawJson = fs.readFileSync(filePath);
  const jsonObject = JSON.parse(rawJson);
  return jsonObject
}

function writeFile(filePath, fileBody) {
  let folderExist = ensureDirectoryExist(filePath)
  if (!folderExist) {
    // TODO: remove log
    return;
  }

  fs.appendFile(filePath, fileBody, function (err) {
    if (err) {
      // TODO: remove log
      throw err
    };
    // TODO: remove log;
  });
}


function ensureDirectoryExist(filePath, counter = 0) {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  let dirCreated = fs.mkdirSync(dirname, { recursive: true });
  let checkFoldersCreated = ensureDirectoryExist(filePath, counter + 1)
  if (checkFoldersCreated) {
    return true;
  } else {
    return false;
  }
}

module.exports = { readJson, writeFile, ensureDirectoryExist }