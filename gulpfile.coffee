gulp    = require 'gulp'
gutil   = require 'gulp-util'
jade    = require 'gulp-jade'
coffee  = require 'gulp-coffee'
stylus  = require 'gulp-stylus'
refresh = require 'gulp-livereload'
browserify = require 'gulp-browserify'
lr      = require 'tiny-lr'
server  = lr()

errHandler = (error) ->
  console.log error.message

gulp.task 'templates', () ->
  gulp.src('./src/html/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./'))

gulp.task 'styles', () ->
  gulp.src('./src/styles/*.styl')
    .pipe(stylus({use: ['nib']}))
    .pipe(gulp.dest('./styles'))

gulp.task 'scripts', () ->
  gulp.src('./src/scripts/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./scripts'))

gulp.task 'default', () ->
  gulp.run 'templates', 'styles', 'scripts'
  
gulp.task 'watch', () ->
  gulp.run 'default'
  gulp.watch './src/**/*.coffee', () ->
    gulp.run('scripts')
  gulp.watch './src/**/*.styl', () ->
    gulp.run('styles')
  gulp.watch './src/**/*.jade', () ->
    gulp.run('templates')

