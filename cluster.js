var pm2 = require('pm2');



pm2.connect (function() {
    pm2.start ({
        script: 'server.js --color',
        exec_mode: 'cluster',
        instances: 0,
        force: true,
        daemon: false,
        max_memory_restart: '100M',
        output: 'logs/calculateroute.log',
        error: 'logs/calculateroute.log'
    }, function (err, apps) {
        pm2.disconnect();
    });
});
