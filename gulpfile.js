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
});
*/


// JS minifying task
gulp.task('uglify', function () {
    return gulp.src(config.assets.client.js.concat(config.assets.client.lib.js))


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




gulp.task('default', ['uglify', 'cssmin']);
