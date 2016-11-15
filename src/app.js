const mysql = require('mysql');
const path = require('path');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const Errors = require('./util/errors');

const app = express();

/* process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
}); */

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'meetAfriend',
  password: 'some_pass',
  database: 'personas'
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'views')));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use((req, res, next) => {
  req.chance = Math.random();
  next();
});

app.get('/get', (req, res) => {
  connection.query('SELECT * FROM employees', (err, rows) => { // get info about people
    if (err) throw err;
    console.log('Data received from Db:\n');
    res.json(rows);
  });
});

app.post('/getFirstLimit', (req, res) => {
  const promise = new Promise((resolve, reject) => {
    if (!req.body.limit) {
      throw new Error('post request missing info');
    }
    connection.query('SELECT * FROM employees LIMIT ?', [req.body.limit], (err, rows) => { // get info about people
      if (err) throw err;
      console.log('Data received from Db:\n');
      if (_.isEmpty(rows)) {
        reject(Error('DB Empty'));
      }
      resolve(rows);
    });
  });
  promise.then((rows) => {
    res.send(rows);
  })
  .catch((err) => {
    console.log(`error occurred ${err.name}`);
    res.sendStatus(403);
  });
});

app.post('/testPost', (req, res) => {
  console.log(req.body);
  res.send(200);
});

app.post('/insert', (req, res) => {
  // adding data to db
  let latestIdInserted;
  const employee = {
    name: req.body.name,
    location: req.body.location
  };
  connection.query('INSERT INTO employees SET ?', employee, (err, result) => {
    if (err) throw err;
    latestIdInserted = result.insertId;
  });
  res.send(latestIdInserted);
});

app.post('/update', (req, res) => {
  // update info in db for id key
  const updateArray = [];
  if (!req.body.id) {
    throw new Error();
  }
  let UpdateString = 'UPDATE employees SET ';
  for (const key in req.body) {
    if (key !== 'id') {
      UpdateString += `${key} = ?,`;
      updateArray.push(req.body[key]);
    }
  }
  updateArray.push(req.body.id);
  UpdateString = UpdateString.substring(0, UpdateString.length - 1);
  UpdateString += ' Where id = ?';

  connection.query(
      UpdateString,
      updateArray,
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
  );
  res.sendStatus(200);
});

app.post('/destroy', (req, res) => {
  if (!req.body.id) {
    throw new Error();
  }
  connection.query(
    'DELETE FROM employees WHERE id = ?',
    [req.body.id],
    (err, result) => {
      if (err) throw err;
      console.log(result);
    }
  );
  res.sendStatus(200);
});

app.post('/select', (req, res) => {
  const promise = new Promise((resolve, reject) => {
    if (!req.body.id) {
      throw new Error();
    }
    connection.query(
      'SELECT * FROM employees WHERE id = ?',
      [req.body.id],
          (err, result) => {
            if (err) throw err;
            if (_.isEmpty(result)) {
              throw new Errors.ExtendableError('fail');
            }
            resolve(result);
          }
    );
    reject(Error('It broke!'));
  });
  promise.then((result) => {
    res.send(result);
  }).catch((err) => {
      console.log(`error occurred ${err.name}`);
    res.sendStatus(403);
  });
});

app.get('/', (req, res) => {
  res.sendFile((path.join(__dirname, '/views/index.html')));
});

app.get('/error', (req, res) => {
  res.send(404);
});

app.use((err, req, res, next) => {
  // log the error, for now just console.log
  console.log(err);
  res.status(500).send('Something broke!');
  next();
});

app.get('/end', (req, res) => {
  connection.end(function(err) {
  if (err) throw err;
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
  });
  res.sendStatus(200);
});

/* function stats (file) {
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
.catch((err) => console.log(err)) */

module.exports = app;
