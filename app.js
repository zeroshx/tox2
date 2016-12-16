var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var passport = require('passport');
var flash = require('connect-flash');
var csurf = require('csurf');
var exfig = require('./configs/express.js');
var mongoInit = require('./init/mongoose.js');
var passportInit = require('./init/passport.js');
var app = express();
/********************************************************************
  EXPRESS CONFIGURATION
********************************************************************/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(cookieParser());
app.use(session({
  name: exfig.session_name,
  secret: exfig.session_secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 30 * 60 * 1000 // 30 minutes
  },
  store: new MongoStore({
    url: exfig.session_store_url
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(csurf());
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return next();
});

/********************************************************************
  EXTERNAL MODULES CONFIGURATION
********************************************************************/
mongoInit();
passportInit();
/********************************************************************
  ROUTING & MOUNTING
********************************************************************/
app.use('/', require('./routes/route.js'));
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
