var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var flash = require('connect-flash');
var csurf = require('csurf');
var helmet = require('helmet');
var exfig = require('./configs/express.js');
var mongoose = require('./setup/mongoose.js');
var app = express();

/********************************************************************
  EXPRESS CONFIGURATION
********************************************************************/
// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, '/public/images/favicon', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({
  limit: '3mb',
  extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(cookieParser());
app.use(session({
  name: exfig.session_name,
  secret: exfig.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false
  },
  store: new MongoStore({
    url: exfig.session_store_url,
    ttl: 60 * 60 // 1hour
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(csurf());
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return next();
});
app.use(helmet());

/********************************************************************
  EXTERNAL MODULES CONFIGURATION
********************************************************************/
mongoose();
app.messenger = require('./setup/messenger.js');
/********************************************************************
  ROUTING & MOUNTING
********************************************************************/
app.use('/', require('./route.js'));
/********************************************************************
  EXPRESS BASIC ROUTE FUNCTION
********************************************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if (err.code === 'EBADCSRFTOKEN') {
      console.log("EBADCSRFTOKEN");
    }
    res.sendStatus(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);
});


module.exports = app;
