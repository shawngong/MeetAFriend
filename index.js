var app = require('./src/app');

var server = app.listen(3000, function(){
  console.log((new Date()) + 'Server is listening on port 3000');
})
