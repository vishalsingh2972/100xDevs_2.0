const fs = require('fs');
// my own asynchronous function
function kiratsReadFile(cb) {
  fs.readFile("a.txt", "utf-8", function(err, data) {
    cb(data);
  });
}
function onDone(data) {
  console.log('second');
  console.log(data);
}
kiratsReadFile(onDone);
console.log('first');