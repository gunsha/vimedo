var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var streamqueue = require('streamqueue');
var gulp = require('gulp');
var cssMin = require('gulp-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var strip = require('gulp-strip-comments');
var clean = require('gulp-remove-empty-lines');
var static = require('node-static');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var prop = require('./gulp.json');
var yargs= require('yargs');
var rename = require('gulp-rename');
var jeditor = require("gulp-json-editor");
var template = require('gulp-template');


function getFolders(dir) {
  return fs.readdirSync(dir)
  .filter(function(file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}
function cap(val){
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  function camel(name) {
    return name.replace(/-([a-z])/g, function(g){ return g[1].toUpperCase(); });
  };
gulp.task('component',function(){
  var name = yargs.argv.name;
  var destPath = path.join('./dev/js/componentes/', name);
  gulp.src('./dev/templates/componentes/*.**')
    .pipe(template({
      name: name,
      camelCaseName: camel(name)
    }))
    .pipe(rename(function(path){
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
    var components = prop.components;
    components.push(name);
    gulp.src("./gulp.json")
    .pipe(jeditor(function(json) {
      json.components = components;
      return json;
    }))
    .pipe(gulp.dest("./"));
});
gulp.task('seccion',function(){
  var name = yargs.argv.name;
  var destPathCtrl = path.join('./dev/js/controller/');
  var destPathSrvc = path.join('./dev/js/servicios/');
  gulp.src('./dev/templates/seccion/tempCtrl.js')
    .pipe(template({
      name: name,
      camelCaseName: camel(name)
    }))
    .pipe(rename(function(path){
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPathCtrl));
    gulp.src('./dev/templates/seccion/tempService.js')
    .pipe(template({
      name: name,
      camelCaseName: camel(name)
    }))
    .pipe(rename(function(path){
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPathSrvc));

    var secciones = prop.secciones;
    secciones.push(name);
    gulp.src("./gulp.json")
    .pipe(jeditor(function(json) {
      json.secciones = secciones;
      return json;
    }))
    .pipe(gulp.dest("./"));
});
gulp.task('css',function(){
  
  var css = prop.css;
  var srcList = [];
  for (var i = 0; i < css.length; i++) {
    srcList.push('./dev/'+css[i]+'.css');
  }

  gulp.src(srcList)
  .pipe(concat('app.css'))
  .pipe(cssMin())
  .pipe(gulp.dest('./css'));
});
gulp.task('scripts',['libs','core']);
gulp.task('libs',function(){
  var libs = prop.libs;
  var srcList = [];
  for (var i = 0; i < libs.length; i++) {
    srcList.push('./dev/lib/'+libs[i]+'.js');
  }
  minifyJs(srcList,'lib');
});
gulp.task('core',function(){
  var core = prop.core;
  var srcList = [];
  for (var i = 0; i < core.length; i++) {
    srcList.push('./dev/js/'+core[i]+'.js');
  }
  var sec = prop.secciones;
  for (var i = 0; i < sec.length; i++) {
    srcList.push('./dev/js/servicios/'+sec[i]+'Service.js');
    srcList.push('./dev/js/controller/'+sec[i]+'Ctrl.js');
  }
  var components = prop.components;
  var componentTemplateList = [];
  for (var i = 0; i < components.length; i++) {
      srcList.push('./dev/js/componentes/'+components[i]+'/'+components[i]+'.js');
      componentTemplateList.push('./dev/js/componentes/'+components[i]+'/'+components[i]+'.html');
    }
  gulp.src(componentTemplateList)
  .pipe(gulp.dest('./components'));
  minifyJs(srcList,'app');
});
gulp.task('watch', function () {
    watch(['dev/js/**/*.js','dev/js/**/*.css','dev/js/**/*.html'], batch(function (events, done) {
        gulp.start('core', done);
    }));

    watch(['dev/css/*.css','dev/js/**/*.css'], batch(function (events, done) {
        gulp.start('css', done);
    }));
    
});

function minifyJs(srcList,filename){

  gulp.src(srcList)
    //.pipe(sourcemaps.init())
    .pipe(concat(filename+'.js'))
    // .pipe(uglify().on('error', function(e){
    //         console.log(e);
    //      }))
    //.pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./js'));
    
}
function joinJs(srcList,filename){

  gulp.src(srcList)
    .pipe(sourcemaps.init())
    .pipe(concat(filename+'.js'))
    .pipe(gulp.dest('./js'));
    
}

gulp.task('build',['css','scripts']);

gulp.task('serve',function () {
  var file = new static.Server({cache:-1});
  require('http').createServer(function (request, response) {
   request.addListener('end', function () {

    if(request.url.indexOf('api')>-1 || request.url.indexOf('auth')>-1){
      var a = request.url.split('/');
      request.url = 'mocks/'+a[a.length-1]+'.json';
      file.serve(request, response);
    }else{
      if(request.url.indexOf('.')>-1){
        file.serve(request, response);
      }
      else{
        file.serveFile('index.html', 200, {}, request, response);
      }
    }
  }).resume();
 }).listen(8082);
});

gulp.task('default', ['build','watch','serve']);
