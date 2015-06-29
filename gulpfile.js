
var gulp = require('gulp');
var android = require('gulp-cordova-build-android');
var rename = require("gulp-rename");

var gls = require('gulp-live-server');
var watch = require('gulp-watch');




gulp.task('build', function() {
    return gulp
        .src('public')
        .pipe(android())
        .pipe(rename('calculateRoute.apk'))
        .pipe(gulp.dest('aplicaciones'))
        .pipe(gulp.dest('C:\\Users\\Javier\\Desktop\\Shared_Folder'))
        .pipe(gulp.dest('C:\\Users\\Javier\\Dropbox'));
});


gulp.task('express', ['build'],  function() {
    var server = gls.new('../server.js');
    server.start();

    gulp.watch(['server/**/*', 'public/**/*'], function () {
        server.notify.apply(server, arguments);
    });
    gulp.watch('../server.js', server.start);

});


gulp.task('default', ['build', 'express']);