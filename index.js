require('./app/index');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const request = require('request-promise');
const passport = require('passport')
const session = require('express-session')
const config = require('./config')

const app = express()

app.listen(3000, function(){
 console.log((new Date()) + ' Server is listening on port 3000');
});

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



const _ = require('lodash');

const fs = require('fs');

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
