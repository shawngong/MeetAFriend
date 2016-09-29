"use strict"
const mysql = require('mysql');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const request = require('request-promise');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();



var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'meetAfriend',
  password : 'some_pass',
  database : 'personas'
});

connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.use(bodyParser());

app.use(express.static(__dirname + 'views'));

app.use((req, res, next) => {
  console.log(req.headers)
  next()
});

app.use((req, res, next) => {
  req.chance = Math.random()
  next()
})

app.get('/get', (req, res) => {
  connection.query('SELECT * FROM employees', function(err,rows){ // get info about people
    if(err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
    res.json(rows);
  });

})

app.post('/testPost', (req, res) => {
  console.log(req.body);
  res.send(200);
})

app.post('/insert', (req, res) => {
  // adding data to db
  let latestIdInserted;
  const employee = {
    name: req.body.name,
    location: req.body.location
  }
  connection.query('INSERT INTO employees SET ?', employee, function(err,result){
  if(err) throw err;

  latestIdInserted = res.insertId;
  });
  res.send(latestIdInserted);
});

app.post('/update', (req, res) => {
  // update info in db for id key
  connection.query(
      'UPDATE employees SET name = ?,location = ? Where ID = ?',
      [req.body.name, req.body.location, req.body.id],
      function (err, result) {
        if (err) throw err;
    }
  );
  res.sendStatus(200);
});


app.get('/', (req, res) => {
  res.sendFile((path.join(__dirname + '/views/index.html')));
})

app.get('/error', (req, res) => {
  res.send(404);
})

app.use((err, req, res, next) => {
  // log the error, for now just console.log
  console.log(err);
  res.status(500).send('Something broke!');
})

app.get('/end', (req, res) => {
  connection.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
  });
})

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
