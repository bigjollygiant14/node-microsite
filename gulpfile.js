'use strict';

var gulp = require('gulp');

//testing
var Server = require('karma').Server

//server
var nodemon = require('gulp-nodemon');

//front end
var sass = require('gulp-sass'); //convert scss to css
var merge = require('merge-stream'); //merge the concatinated files
var concat = require('gulp-concat'); //concat multiple files into one file
var sassGlob = require('gulp-sass-glob'); //handle globbing in scss manifest so we don't need to import every sass file
var uglify = require('gulp-uglify'); //minify js
var sequence = require('run-sequence'); //for sequencing gulp tasks
var del = require('del'); // file deleting
var bs = require('browser-sync').create();

//vars
var config = {
  env: 'dev',
  build_dir: 'build',
  sass: {
    manifest: './public/css/global/app.scss',
    dest: './public/css',
    fileName: 'app.min.css',
    sassLocations: ['./public/views/**/*.scss','./public/css/global/*.scss']
  },
  html: {
    src: 'public/**/*.html'
  },
  js: {
    config: '/karma.conf.js',
    src: 'public/js/**/*.js',
    spec: 'public/js/**/*.spec.js',
    dest: 'public/js',
    minifiedName: 'app.min.js'
  }
}

gulp.task('sass', function(){
  var scssStream = gulp.src(config.sass.manifest)
    .pipe(sassGlob())
    .pipe(sass());

  var mergedStream = merge(scssStream)
    .pipe(concat(config.sass.fileName))
    .pipe(gulp.dest(config.sass.dest));
  
  return mergedStream;
});

gulp.task('js', function(){
  var jsStream = gulp.src([ config.js.src, '!' + config.js.spec, '!' + config.js.dest + '/' + config.js.minifiedName ])
    .pipe(concat(config.js.minifiedName))
    .pipe(uglify())
    .pipe(gulp.dest(config.js.dest));
  
  return jsStream;
});

gulp.task('test', function(done){
  new Server({
    configFile: __dirname + config.js.config,
    singleRun: true
  }, done).start();
});

gulp.task('browser-sync', ['start'], function() {
  bs.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    browser: 'google-chrome',
    port: 5000,
  });
});

gulp.task('start', function(){
  var started = false;

  nodemon({
    script: 'server.js',
    env: { 'NODE_ENV': 'development'}
  }).on('start', function(){
    if (!started) {
      cb();
      started = true; 
    } 
  });
});

gulp.task('watch', function(){
  gulp.watch(config.sass.sassLocations, ['sass', bs.reload]);
  gulp.watch(config.js.src, ['js', bs.reload]);
  gulp.watch(config.html.src, bs.reload);
});

// Clear the build folder
gulp.task('clean', function() {
  del([
    config.build_dir + '/*',
  ]);
});

// Copy required files to build folder
gulp.task('copy', function() {
  return gulp.src([
      'public/**',
      '!' + config.js.dest + '/**/!(' + config.js.minifiedName + ')',
      '!' + 'public/css/**/!(' + config.sass.fileName + ')',
      '!' + 'public/views{,/**}'
    ])
    .pipe(gulp.dest(config.build_dir + '/'));
});

gulp.task('build', function(cb) {
  console.log('[gulp.build] ENV: ' + config.env);
  sequence('clean', ['sass', 'js'], 'copy', cb);
});

gulp.task('default', ['sass','js','browser-sync','watch'], function(){});