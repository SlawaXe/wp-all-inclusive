'use strict';

//-- Requers
var gulp         = require('gulp'),
    browserify   = require('gulp-browserify'),
    sass         = require('gulp-sass'),
    minifyJs     = require('gulp-uglify'),
    minifycss    = require('gulp-uglifycss'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb      = require('gulp-csscomb'),
    mmq          = require('gulp-merge-media-queries'),
    strip        = require('gulp-strip-comments'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync').create(),
    reload       = browserSync.reload({stream: true}),
    watch        = require('gulp-watch'),
    gulpsync     = require('gulp-sync')(gulp),
    imagemin     = require('gulp-imagemin'),
    imageminJpeg = require('imagemin-mozjpeg'),
    imageminPng  = require('imagemin-optipng'),
    rename       = require('gulp-rename'),
    clean        = require('gulp-clean'),
    jade         = require('gulp-jade');

//-- Variables
var domain       = 'wp-start-new.lc',
    port         = 7005,
    projectDir   = 'content/themes/default-theme/',
//  htmlTemplate = 'template/',
//  htmlBuild    = projectDir,
//  htmlPretty   = true,
    styleSass    = 'assets/sass/style.scss', // Main file scss
    styleWatch   = 'assets/sass/**/*.scss', // scss files to be monitored
    styleBuild   = projectDir, // where to put the compiled css file
    jsFile       = 'assets/js/', // main file bundle
    jsBuild      = projectDir + 'js/';
//  imgUrl       = 'assets/img/**/*',
//  imgUrlBuild  = projectDir + 'img';

//-- Browsers you care about for autoprefixing.
//-- Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

gulp.task( 'browser-sync', function() {
    browserSync.init( {
        // For more options
        // @link http://www.browsersync.io/docs/options/
        proxy: domain,
        // `true` Automatically open the browser with BrowserSync live server.
        // `false` Stop the browser from automatically opening.
        open: true,
        // Inject CSS changes.
        // Commnet it to reload browser for every CSS change.
        injectChanges: true,
        // Use a specific port (instead of the one auto-detected by Browsersync).
        port: port,
        // Open the site in Firefox
        browser: 'firefox'
    } );
});

//-- Jade
gulp.task('jade', function(){
  gulp.src(htmlTemplate + '/*.jade')
    .pipe(jade({
        pretty: htmlPretty
    }))
    .on('error', console.error.bind(console))
    .pipe(browserSync.stream())
    .pipe(gulp.dest(htmlBuild))
});

gulp.task( 'img', function() {
    return gulp.src( imgUrl )
    .pipe( imagemin([
        imageminJpeg({
            quality: 85
        }),
        imagemin.optipng({
            optimizationLevel: 5
        })
    ]))
    .pipe(gulp.dest(imgUrlBuild));
});

gulp.task( 'clean:img', ['img'], function() {
    gulp.src(imgUrl, {read: false})
        .pipe(clean());
});

//-- default task js
gulp.task('js', function() {
    return gulp.src(jsFile + 'main.js')
           .pipe(sourcemaps.init())
           .pipe(browserify({debug:true}))
           .pipe(rename({suffix:'.min'}))
           .pipe(gulp.dest(jsBuild))
           .pipe(sourcemaps.write())
           .pipe(browserSync.stream())
});

gulp.task('js:beautifier', function() {
    gulp.src(styleBuild + '**/*.js', {read: false}).pipe(clean());

    return gulp.src(jsFile + 'main.js')
           .pipe(browserify({debug:true}))
           .pipe(gulp.dest(jsBuild))
});

gulp.task('js:min', ['js:beautifier'], function() {
    gulp.src(jsBuild + '**/*.js')
           .pipe(minifyJs())
           .pipe(strip.text())
           .pipe( rename( { suffix: '.min' } ) )
           .pipe(gulp.dest(jsBuild))
});

gulp.task('css:beautifier', function() {
    gulp.src(styleBuild + '**/*.css', {read: false}).pipe(clean());

    return gulp.src(styleSass)
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(mmq({log:true}))
    .pipe(autoprefixer( AUTOPREFIXER_BROWSERS ))
    .pipe(csscomb({configPath:'./.csscomb.json'}))
    .pipe(gulp.dest(styleBuild))
});

gulp.task('css:min', ['css:beautifier'], function() {
    gulp.src(styleBuild + '**/*.css')
    .pipe( minifycss( {
        maxLineLen: 10,
        cuteComments: false
    }))
    .pipe(strip.text())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(styleBuild ))
});

gulp.task('sass', function() {
    gulp.src(styleSass)
    .pipe(sourcemaps.init())
    .pipe(sass( {
        errLogToConsole: true,
        precision: 10
    }))
    .on('error', console.error.bind(console))
    .pipe(sourcemaps.write( { includeContent: false } ) )
    .pipe(sourcemaps.init( { loadMaps: true } ) )
    .pipe(sourcemaps.write () )
    .pipe(browserSync.stream())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(styleBuild ))
});

gulp.task('watch_img', ['clean:img'], function() {
    gulp.watch( imgUrl, ['img', 'clean:img']);
});

// gulp.task( 'default', ['sass', 'js', 'browser-sync', 'watch_img', 'jade'], function () {
gulp.task( 'default', ['sass', 'js', 'browser-sync'], function () {
    //-- Reload files changes.
    gulp.watch( styleWatch, [ 'sass' ] );
    gulp.watch( jsFile + '**/*.js', ['js'] );
    gulp.watch( projectDir + '**/*.php' ).on('change', browserSync.reload);
    // gulp.watch("web/*.html").on('change', browserSync.reload);
    // gulp.watch('template/**/*.jade',['jade']);
});

// gulp.task('build', ['css:min', 'js:min', 'clean:img', 'jade']);
gulp.task('build', ['css:min', 'js:min']);