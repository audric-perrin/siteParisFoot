'use strict'

var gulp         = require('gulp')

var del          = require('del')
var browserify   = require('browserify')
var lazypipe     = require('lazypipe')
var source       = require('vinyl-source-stream')
var buffer       = require('vinyl-buffer')

var autoprefixer = require('gulp-autoprefixer')
var cache        = require('gulp-cache')
var concat       = require('gulp-concat')
var htmlmin      = require('gulp-htmlmin')
var gulpif       = require('gulp-if')
var htmlhint     = require("gulp-htmlhint")
var imagemin     = require('gulp-imagemin')
var minifyCSS    = require('gulp-minify-css')
var rename       = require('gulp-rename')
var rev          = require('gulp-rev')
var revReplace   = require('gulp-rev-replace')
var size         = require('gulp-size')
var sourcemaps   = require('gulp-sourcemaps')
var uglify       = require('gulp-uglify')
var useref       = require('gulp-useref')
var gutil        = require('gulp-util')

var SRC     = './app'
var DIST    = './'

var STYLES_SRC_FOLDER   = SRC + '/styles'
var STYLES_DEST_FOLDER  = DIST + 'styles'
var STYLES_DEST_NAME    = 'app.min.css'

var SCRIPTS_SRC_FOLDER  = SRC + '/scripts'
var SCRIPTS_DEST_FOLDER = DIST + 'scripts'
var SCRIPTS_DEST_NAME   = 'app.min.js'

var IMAGES_SRC_FOLDER   = SRC + '/images'
var IMAGES_DEST_FOLDER  = DIST + 'images'

var SCRIPTS_ENTRY_POINT = SCRIPTS_SRC_FOLDER + '/main.js'
var HTML_ENTRY_POINT    = SRC + '/index.html'

var TMP_FOLDER          = './tmp'

var _isWatching = false


// Delete caches and every generated files
gulp.task('clean', function(cb) {
  cache.clearAll()
  del.sync([
    TMP_FOLDER,
    STYLES_DEST_FOLDER,
    SCRIPTS_DEST_FOLDER,
    IMAGES_DEST_FOLDER,
    DIST + 'index.html'
  ])
  cb()
})

// CSS task: minify + autoprefix + concat
gulp.task('styles', function() {
  return gulp.src(STYLES_SRC_FOLDER + '/**/*.css')
    .pipe(sourcemaps.init({loadMaps: true})) // TODO - Remove when in prod
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat(STYLES_DEST_NAME))
    .on('error', gutil.log)
    .pipe(rev())
    .pipe(sourcemaps.write('./')) // TODO - Remove when in prod
    .pipe(gulp.dest(STYLES_DEST_FOLDER))
    .pipe(rev.manifest('styles.manifest.json'))
    .pipe(gulp.dest(TMP_FOLDER))
})

// Javascript task: browserify + sourcemaps + uglify
gulp.task('scripts', function() {
  return browserify({
    entries: SCRIPTS_ENTRY_POINT,
    debug: true // TODO - Remove when in prod
  }).bundle()
    .pipe(source(SCRIPTS_DEST_NAME))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // TODO - Remove when in prod
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(rev())
    .pipe(sourcemaps.write('./')) // TODO - Remove when in prod
    .pipe(gulp.dest(SCRIPTS_DEST_FOLDER))
    .pipe(rev.manifest('scripts.manifest.json'))
    .pipe(gulp.dest(TMP_FOLDER))
})

// Image task: try to optimize + move images to final destination
gulp.task('images', function() {
  // Manually move some hardcoded assets
  gulp.src('bower_components/chosen/chosen-sprite*.png')
    .pipe(gulp.dest(STYLES_DEST_FOLDER))
  // Compress and move our images
  return gulp.src(IMAGES_SRC_FOLDER + '/**/*')
    .pipe(cache(imagemin({ // Just-in-case optimization. Please use tiny-png.org.
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(IMAGES_DEST_FOLDER))
})

// HTML task: bundle + minify/uglify + revision vendor files
gulp.task('html', function() {
  return gulp.src(DIST + 'index.html') // Use the index.html file generated during the 'rev' task
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true }))) // TODO - Remove sourcemap when in prod
    .pipe(gulpif('*.js', gulpif(!_isWatching, uglify())))
    .pipe(gulpif('*.css', minifyCSS()))
    .pipe(gulpif('*.js', rev()))
    .pipe(gulpif('*.css', rev()))
    .pipe(htmlhint())
    .pipe(gulpif('*.html', htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeTagWhitespace: true,
      // removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      preventAttributesEscaping: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(revReplace())
    .pipe(sourcemaps.write(DIST))
    .pipe(gulp.dest(DIST))
})

// Versioning: replace the references in index.html to the revisioned files
// (note: this does not include the vendor bundle, this is done during the 'html' task)
gulp.task('rev', function() {
  // This files have been generated during the 'scripts' and 'styles' tasks
  var manifest = gulp.src(TMP_FOLDER + '/*.manifest.json')
  return gulp.src(HTML_ENTRY_POINT)
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(DIST))
})

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'images',
    gulp.series(
      gulp.parallel('styles', 'scripts'),
      'rev',
      'html'
    )
  )
))

gulp.task('watchAll', function() {
  _isWatching = true
  gulp.watch(HTML_ENTRY_POINT, gulp.series('rev', 'html'));
  gulp.watch(IMAGES_SRC_FOLDER + '/**/*', gulp.series('images'));
  gulp.watch(SCRIPTS_SRC_FOLDER + '/**/*.js', gulp.series('scripts', 'rev', 'html'));
  gulp.watch(STYLES_SRC_FOLDER + '/**/*.css', gulp.series('styles', 'rev', 'html'));
})

gulp.task('watch', gulp.series('build', 'watchAll'))
