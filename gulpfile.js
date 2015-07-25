var config = require ('./config/env/default'),
    gulp = require ('gulp'),
    gulpLoadPlugins = require ('gulp-load-plugins'),
    plugins = gulpLoadPlugins ();


/*
gulp.task('cordova-debug', function() {
    return gulp
        .src('public')
        .pipe(android())
        .pipe(rename('calculateRoute.apk'))
        .pipe(gulp.dest('aplicaciones'))
        .pipe(gulp.dest('C:\\Users\\Javier\\Desktop\\Shared_Folder'))
        .pipe(gulp.dest('C:\\Users\\Javier\\Dropbox'));
});
*/

// JS minifying task
gulp.task('uglify', function () {
    return gulp.src(config.assets.client.lib.js.concat(config.assets.client.js))
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.concat('calculateroute.min.js'))
        .pipe(gulp.dest('app/client/lib'));
});

// CSS minifying task
gulp.task('cssmin', function () {
    return gulp.src(config.assets.client.css.concat(config.assets.client.lib.css))
        .pipe(plugins.cssmin())
        .pipe(plugins.concat('calculateroute.min.css'))
        .pipe(gulp.dest('app/client/lib'));
});




gulp.task('default', ['cssmin']);
