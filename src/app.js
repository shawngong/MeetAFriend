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
  user     : 'admin',
  password : 'secret',
  database : 'meetAFriend'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();

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
  res.json({
    chance: req.chance
  })
})

app.post('/testPost', (req, res) => {
  console.log(req.body);
  res.send(200);
})


app.get('/', (req, res) => {
  res.sendFile((path.join(__dirname + '/views/index.html')));
})

app.get('/error', (req, res) => {
  res.send(404);
})

app.use((err, req, res, next) => {
  // log the error, for now just console.log
  console.log(err);
  response.status(500).send('Something broke!');
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
