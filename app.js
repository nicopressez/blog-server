require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const asyncHandler = require("express-async-handler");
const app = express();
var cors = require('cors')
//Mongo setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Passport setup
const passport = require("./passport");

app.use(cors())

app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
