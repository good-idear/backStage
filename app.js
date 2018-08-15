var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multer = require('multer');
var multerObj = multer({ dest:'./libs/upload'});

var indexRouter = require('./routes/index.js');
var showRouter = require('./routes/web.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multerObj.any());

app.use(cookieParser());
(function(){
	var keys = [];
	for(var i = 0; i < 100000; i++){
		keys[i] = 'a_' + Math.random();
	}
	app.use(cookieSession({
		name:'sess_id',
		keys:keys,
		maxAge:20*60*1000
	}))
})()
app.use('/register',showRouter);
app.use('/admin', indexRouter);


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
