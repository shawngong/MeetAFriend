"use strict"

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

app.use(bodyParser());

app.use(express.static(__dirname + 'views'));

app.use((request, response, next) => {
  console.log(request.headers)
  next()
});

app.use((request, response, next) => {
  request.chance = Math.random()
  next()
})

app.get('/get', (request, response) => {
  response.json({
    chance: request.chance
  })
})

app.post('/testPost', (request, response) => {
  response.json({
    id: request.body.id
  })
  //response.send(200);
})


app.get('/', (request, response) => {
  response.sendFile((path.join(__dirname + '/views/index.html')));
})

app.get('/error', (request, response) => {
  throw new Error('oops')
})

app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err)
  response.status(500).send('Something broke!')
})

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

module.exports = app;
