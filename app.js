const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const uuid         = require('node-uuid');
const assignId     = require('./middlewares/assignId');
const Index        = require('./controllers');
const app          = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

morgan.token('id', function getId(req) {
  return req.log_uuid;
});

app.use(assignId);
app.use(morgan(':status :method :url :response-time :date[web]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  genid : function(req) {
    return uuid.v4(); // use UUIDs for session IDs
  },
  secret: 'Learning point',
  name  : 'valve_token',
  cookie: {
    httpOnly: true,
    maxAge  : 1000 * 60 * 10,
  },
}));
app.use(express.static(path.join(__dirname, 'static')));

/**
 * router
 */
app.use('/', function(req, res, next) {

  let index = new Index();

  index.index(req, res, next);
})

/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {

  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});

/**
 * error handler
 */
app.use(function(err, req, res, next) {

  console.warn(`[NEXT]: ErrorID:${err.log_uuid}`);

  // 写入日志
  console.error(err);

  // render the error page
  res.status(err.status || 500);
  res.render('common/error', {message: '', error: err});
});

/**
 * error handler
 */
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

module.exports = app;


