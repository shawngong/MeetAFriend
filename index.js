require('./app/index');

const _ = require('lodash');

const fs = require('fs');

_.assign({ 'a': 1 }, { 'b': 2 }, { 'c': 3 });

function stats (file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, data) => {
      if (err) {
        return reject (err)
      }
      resolve(data)
    })
  })
}

Promise.all([
  stats('file1.md')
])
.then((data) => console.log(data))
.catch((err) => console.log(err))
