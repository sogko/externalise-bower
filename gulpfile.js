var gulp = require('gulp')
  , _ = require('lodash')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , sequence = require('run-sequence')
  , bowerResolve = require('bower-resolve')
  , connect = require('gulp-connect-multi')();


// read bower.json and get dependencies' package ids
var bowerManifest = {};
try {
    bowerManifest = require('./bower.json');
} catch (e) {
    // does not have a bower.json manifest
}
var bowerPackageIds = _.keys(bowerManifest.dependencies);

gulp.task('default', function () {
    sequence('dist-vendor','dist-js','dist-html', 'connect');
});

/**
 * Browserify using a dummy entry point, 'requiring' the bower components on prebundle
 */
gulp.task('dist-vendor', function() {

    var b = browserify();

    // get all bower components ids and resolve the ids to their 'endpoint', which we need for require()
    bowerPackageIds.forEach(function (id) {
        b.require(bowerResolve.fastReadSync(id), { expose: id });
    });

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./build'));
});


/**
 * Browserify using your main application entry point, 'external'ising the bower components on prebundle
 */
gulp.task('dist-js', function() {

    var b = browserify('./src/js/app.js');

    // get all bower components ids
    bowerPackageIds.forEach(function (id) {
        b.external(id);
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build'));
});


/**
 * Copy over our html
 */
gulp.task('dist-html', function() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./build'));
});


/**
 * Finally launch the html to see if it all worked
 */
gulp.task('connect', connect.server({
    root: ['./build'],
    port: '3000',
    livereload: { port: 35729 },
    open: {
        file: 'index.html'
    }
}));