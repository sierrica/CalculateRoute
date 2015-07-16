var gulp = require('gulp'),
    connect = require('gulp-connect-pm2'),
    android = require('gulp-cordova-build-android'),
    rename = require("gulp-rename"),
    exec = require('child_process').exec;


gulp.task('cordova-debug', function() {
    return gulp
        .src('public')
        .pipe(android())
        .pipe(rename('calculateRoute.apk'))
        .pipe(gulp.dest('aplicaciones'))
        .pipe(gulp.dest('C:\\Users\\Javier\\Desktop\\Shared_Folder'))
        .pipe(gulp.dest('C:\\Users\\Javier\\Dropbox'));
});


gulp.task('pm2_bis', function () {

    var pm2 = require('pm2');

    pm2.connect(function() {
        pm2.start({
            error_file: "/dev/null",
            out_file: "/dev/null",
            script: 'server.js --no-daemon',
            exec_mode: 'cluster',
            instances: 0
        }, function(err, apps) {
            pm2.disconnect();
        });
    });
});




gulp.task('pm2', function (cb) {
    exec('node_modules\\.bin\\pm2 start cluster.json --no-daemon -f --env prod', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})



gulp.task('default', ['pm2']);
