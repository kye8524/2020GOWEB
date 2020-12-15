var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cUtil = require('./customUtil');
var mysql_odbc = require('./database/db_conn')();
var conn = mysql_odbc.init();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1

  next();
});
app.use(cUtil.tokenMiddleWare);

app.use('/mysql', require('./routes/mysql'));
app.use('/notice', require('./routes/notice'));
app.use('/auth', require('./routes/auth'));
app.use('/charge',require('./routes/charge'));
app.use('/index',require('./routes/index'));
app.use('/charity',require('./routes/project'));
app.use('/budget',require('./routes/budget'));
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

setInterval(function () {
  conn.query('SELECT 1');
}, 5000);

module.exports = app;
