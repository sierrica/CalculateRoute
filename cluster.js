var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(function() {
    pm2.start({
        force: true,

        args: ["--color"],

        merge_logs: true,
        out_file: '/var/lib/openshift/559166e75973ca26ac00007f/app-root/logs/pm2.log',
        error_file: '/var/lib/openshift/559166e75973ca26ac00007f/app-root/logs/pm2_error.log',
        script    : 'server.js',
        name      : 'calculateroute',
        exec_mode : 'cluster',
        instances : instances,
        max_memory_restart : maxMemory + 'M',
        env: {                                          // If needed declare some environment variables
            "NODE_ENV": "production",
        },
    }, function(err) {
        if (err) return console.error('Error while launching applications', err.stack || err);
        console.log('PM2 and application has been succesfully started');
    });
});