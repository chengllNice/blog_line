var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('./config/mongodb')();

var admin = require('./routes/admin');
var manage = require('./routes/manage');

var app = express();

// view engine setup
/*app.set('public', path.join(__dirname, 'public'));
app.set('views engine', 'html');*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser('userInfo'));
app.use(express.static(path.join(__dirname, '/dist')));
app.use(session({
    name: 'userInfo',
    secret: 'userInfo',
    resave: true,
    saveUninitialized:true,
    cookie: { maxAge: 1000*60*60*60*24 }
}));

app.use('/admin', admin);
app.use('/manage', manage);

module.exports = app;
