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

//-- Config
var config = {
    //proxy: 'site-name.local',
    proxy: 'wp-start-new.lc',
    port: 707,
    browser: 'firefox', // google chrome | firefox | opera
    openBrowser: true, // true | false
    autoprefixLastVer: 4, // 1-4
    path: {
        projectDir: 'content/themes/default-theme/',
        mainSass: 'content/themes/default-theme/assets/sass/style.scss',
        sass: 'content/themes/default-theme/assets/sass/**/*.scss',
        css: 'content/themes/default-theme/',
        js: 'content/themes/default-theme/assets/js/',
        jsReady: 'content/themes/default-theme/js/',
        imgTemp: 'content/themes/default-theme/img/temp/',
        imgReady: 'content/themes/default-theme/img/'
    }
};

//-- Browsers you care about for autoprefixing.
//-- Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last '+ config.autoprefixLastVer +' version',
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

/*
*  Common task
*/
gulp.task( 'browser-sync', function() {
    browserSync.init({
        // For more options
        // @link http://www.browsersync.io/docs/options/
        proxy: config.proxy,
        // `true` Automatically open the browser with BrowserSync live server.
        // `false` Stop the browser from automatically opening.
        open: config.openBrowser,
        // Inject CSS changes.
        // Commnet it to reload browser for every CSS change.
        injectChanges: true,
        // Use a specific port (instead of the one auto-detected by Browsersync).
        port: config.port,
        // Open the site in Firefox
        browser: config.browser
    });
});

gulp.task('cssjs:clear', function(done) {
    gulp.src(config.path.css + '**/*.css', {read: false}).pipe(clean());
    gulp.src(config.path.jsReady + '**/*.js', {read: false}).pipe(clean());

    done();
});

/*
*  JS task
*/
gulp.task('js', function() {
    return gulp.src(config.path.js + 'main.js')
           .pipe(sourcemaps.init())
           .pipe(browserify({debug:true}))
           .pipe(rename({suffix:'.min'}))
           .pipe(gulp.dest(config.path.jsReady))
           .pipe(sourcemaps.write())
           .pipe(browserSync.stream())
});

gulp.task('js:beautifier', function(done) {
    gulp.src(config.path.js + 'main.js')
        .pipe(browserify({debug:true}))
        .pipe(gulp.dest(config.path.jsReady));

    done();
});


gulp.task('js:min', function(done) {
    gulp.src(config.path.js + 'main.js')
        .pipe(browserify({debug:true}))
        .pipe(minifyJs())
        .pipe(strip.text())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(config.path.jsReady));

    done();
});

gulp.task('js:build', gulp.series('js:min', 'js:beautifier'));

/*
*  CSS/SASS task
*/
gulp.task('css:beautifier', function(done) {
    gulp.src(config.path.mainSass)
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(mmq({log:true}))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(csscomb({configPath:'./.csscomb.json'}))
    .pipe(gulp.dest(config.path.css))

    done();
});

gulp.task('css:min', function(done) {
    gulp.src(config.path.mainSass)
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(mmq({log:true}))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(csscomb({configPath:'./.csscomb.json'}))
    .pipe( minifycss({
        maxLineLen: 10,
        cuteComments: false
    }))
    .pipe(strip.text())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(config.path.css))

    done();
});

gulp.task('sass', function(done) {
    gulp.src(config.path.mainSass)
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true,
        precision: 10
    }))
    .on('error', console.error.bind(console))
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write ())
    .pipe(browserSync.stream())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(config.path.css));

    done();
});

gulp.task('css:build', gulp.series('css:min', 'css:beautifier'));

/*
*  Images task
*/
gulp.task('img', function() {
    return gulp.src(config.path.imgTemp)
    .pipe( imagemin([
        imageminJpeg({
            quality: 85
        }),
        imagemin.optipng({
            optimizationLevel: 5
        })
    ]))
    .pipe(gulp.dest(config.path.imgReady));
});

gulp.task('clean:img', function(done) {
    gulp.src(config.path.imgTemp, {read: false})
        .pipe(clean());

    done();
});


/*
*  Mains task
*/
gulp.task('watch', function (done) {
  //-- Reload files changes.
  gulp.watch(config.path.sass, gulp.series('sass')).on('change', browserSync.reload);
  gulp.watch(config.path.js + '**/*.js', gulp.series('js')).on('change', browserSync.reload);
  gulp.watch(config.path.projectDir + '**/*.php' ).on('change', browserSync.reload);
  // gulp.watch(config.path.imgTemp, gulp.series('img', 'clean:img')).on('change', browserSync.reload);

  done();
});

gulp.task('default', gulp.series('sass', 'js', 'watch', 'browser-sync', (done) => {
    done();
}));

// gulp.task('build', gulp.series('cssjs:clear', 'css:build', 'js:build', 'img', 'clean:img'));
gulp.task('build', gulp.series('cssjs:clear', 'css:build', 'js:build'));