var gulp = require('gulp')
var tsify = require('tsify')
// var log = require('fancy-log')
// var gutil = require('gulp-util')
// var watch = require('gulp-watch')
var watchify = require('watchify')
// var ts = require('gulp-typescript')
// var plumber = require('gulp-plumber')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var uglify = require('gulp-uglify-es').default
// var obfuscate = require('gulp-javascript-obfuscator')

var watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: false,
  entries: ['src/pusher.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify))

function bundle () {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
    // .on('end', () => {
    //   gulp.src('dist/bundle.js')
    //     .pipe(uglify())
    //     .pipe(gulp.dest('dist'))
    // })
}

watchedBrowserify.on('update', bundle)
gulp.task('default', bundle)

// gulp.task('watch', function (cb) {
//   watch('src/*.ts', () => {
//     gulp.src('src/*.ts')
//       .pipe(plumber())
//       .pipe(ts({
//         noImplicitAny: false,
//         target: 'es2015',
//         module: 'CommonJS'
//       }))
//       .pipe(browserify({
//         debug: true
//       }))
//       // .plugin(tsify)
//       // .bundle()
//       // .pipe(source('bundle.js'))
//       // .pipe(uglify())
//       // .pipe(obfuscate({compact: true}))
//       .pipe(gulp.dest('built'))
//       .on('end', function () { log('Done!') })
//   })
// })
