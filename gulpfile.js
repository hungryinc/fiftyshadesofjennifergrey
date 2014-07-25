var argv = require('yargs').argv;
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var watchify = require('watchify');
var source = require('vinyl-source-stream')
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var jsonminify = require('gulp-jsonminify');
var protractor = require("gulp-protractor").protractor;
var build = argv.build;

if ( ! build) {
    var livereload = require('gulp-livereload');
    gulp.task('default', ['less', 'html', 'data', 'copy-images', 'copy-fonts', 'watch']);
} else {    
    gulp.task('default', ['less', 'data', 'html', 'copy-images', 'copy-fonts']);
}

var paths = {
    data: 'app/src/data/**/*',
    less: 'app/src/less/**/*',
    html: 'app/src/html/**/**/*',
    images: 'app/src/img/**/*',
    fonts: 'app/src/fonts/**/*'
}

var onError = function(err) {
    gutil.beep();
    console.error(err.message);
}

gulp.task('data', function() {
    gulp.src(paths.data)
        .pipe(jsonminify())
        .pipe(gulp.dest('app/release/data'));    
})

gulp.task('less', function() {
    var process = gulp.src('app/src/less/fiftyshadesofjennifergrey.less')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')],
            sourceMap: true
        }))
        .pipe(gulp.dest('app/release/styles'))

        if ( ! build) {
            process.pipe(livereload());
        } else {
            process.pipe(minifyCSS())
                .pipe(gulp.dest('app/release/styles'));
        }
});

gulp.task('html', function() {
    var process = gulp.src(paths.html)
        .pipe(minifyHTML({
            comments: false,
            spare: true,
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('app/release/html'))
        
        if ( ! build) {
            process.pipe(livereload());
        }
});

gulp.task('copy-images', function() {
    gulp.src(paths.images)
        .pipe(gulp.dest('app/release/img'))
});

gulp.task('copy-fonts', function() {
    gulp.src(paths.fonts)
        .pipe(gulp.dest('app/release/fonts'))
});

gulp.task('watch', function() {
    if ( ! build) {
        gulp.watch(paths.less, ['less']);
        gulp.watch('imports/greyscale/*.less', ['less']);
        gulp.watch(paths.images, ['copy-images']);
        gulp.watch(paths.fonts, ['copy-fonts']);
        gulp.watch(paths.html, ['html']);
        gulp.watch(paths.data, ['data']);
    }
});

// The default task (called when you run `gulp` from cli)
gulp.task('test', ['protractor']);