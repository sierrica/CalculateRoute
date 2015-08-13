var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(function() {
    pm2.start({
        script    : 'server.js',
        name      : 'calculateroute',
        exec_mode : 'cluster',
        instances : instances,
        max_memory_restart : maxMemory + 'M',
        env: {                                          // If needed declare some environment variables
            "NODE_ENV": "production",
            "AWESOME_SERVICE_API_TOKEN": "xxx"
        },
    }, function(err) {
        if (err) return console.error('Error while launching applications', err.stack || err);
        console.log('PM2 and application has been succesfully started');
    });
});