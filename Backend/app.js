var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
// var connection = mongoose.connect('mongodb://localhost/vimedo');
var connection = mongoose.connect('mongodb://admin:admin@vimedo-shard-00-00-9ou8j.mongodb.net:27017,vimedo-shard-00-01-9ou8j.mongodb.net:27017,vimedo-shard-00-02-9ou8j.mongodb.net:27017/vimedo?replicaSet=vimedo-shard-0&ssl=true&authSource=admin');
// var connection = mongoose.connect('mongodb://localhost:8082/vimedo');


var usuarios = require('./routes/Usuarios');
var admin = require('./routes/Admin');
var afiliados = require('./routes/Afiliados');
var profesionales = require('./routes/Profesionals.js');
var prepagas = require('./routes/Prepagas');
var antecedentesMedicos = require('./routes/AntecedentesMedicos');
var imagenes = require('./routes/Imagens');
var solicitudesMedicas = require('./routes/SolicitudesMedicas');
var especialidades = require('./routes/Especialidades');
var coordenadas = require('./routes/CoordenadasProfesionales');
var mensajes = require('./routes/Mensajes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    if ('OPTIONS' === req.method) {
        res.status(204).send();
    }
    else {
        next();
    }
});


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', admin);
app.use('/afiliados', afiliados);
app.use('/users', usuarios);
app.use('/profesionales', profesionales);
app.use('/prepagas', prepagas);
app.use('/antecedentesMedicos', antecedentesMedicos);
app.use('/img', imagenes);
app.use('/solicitudesMedicas', solicitudesMedicas);
app.use('/especialidades', especialidades);
app.use('/coordenadas', coordenadas);
app.use('/mensajeria',mensajes);

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
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
