var gulp = require('gulp')
  , packager = require('./lib/packager')({debug: true})
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , sequence = require('run-sequence')
  , connect = require('gulp-connect-multi')();


gulp.task('default', function () {
    sequence('dist-vendor','dist-js','dist-html', 'connect');
});


/**
 * Browserify using a dummy entry point, 'requiring' the bower components on prebundle
 */
gulp.task('dist-vendor', function() {

    var b = browserify();

    // get all bower components ids and resolve the ids to their 'endpoint', which we need for require()
    packager.getPackageIds().forEach(function (id) {
        var p = packager.getPackageEndpoint(id);
        packager.log('Browserify::require: ', id + ' - '+p[0]);
        b.require(p[0], { expose: id });
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

    // get all bower components names and resolve the names to their id
    packager.getPackageNames().forEach(function (id) {
        packager.log('Browserify::external: ' + id);
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