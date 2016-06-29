//server.js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//Config
var port = process.env.PORT || 3000;

//DB
//var db = require('./config/db');

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override'));

//Routes
require('./app/routes')(app);

//Start
app.listen(port, '0.0.0.0');

exports = module.exports = app;