var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs');
var multer = require('multer');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var objmulter = multer({ dest: './public/images/' });



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
var bqbRouter = require('./routes/pabqb');
var groupRouter = require('./routes/groups');

var app = express();

app.use(session({
  secret:'secret',  //用它来对session cookie签名，防止篡改
  resave:true,
  saveUninitialized:false,
  name:'ljhwebsite',
  cookie:{
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));



app.ready = function(server) {
  chatRouter.socket(server);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.use(objmulter.any());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/public/images/*', function (req, res) {
  res.sendFile( __dirname + "/" + req.url );
})



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/pabqb', bqbRouter);
app.use('/group',groupRouter);




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
