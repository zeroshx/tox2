var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var passport = require('passport');
var flash = require('connect-flash');
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
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(cookieParser());
app.use(session({
    secret: exfig.session_secret,
    resave: true,
    saveUninitialized: true,
    cookie : { path: '/', httpOnly: true, secure: false, maxAge: 10 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
