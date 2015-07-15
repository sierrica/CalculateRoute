var cluster     = require ('cluster'),
    config      = require ('./config/config');

if (cluster.isMaster) {

    var numCPUs = require('os').cpus().length;

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });
}
else {
    var express     = require ('./config/express'),
        mongoose    = require ('./config/mongoose'),
        logger      = require ('./config/logger'),
        redis       = require ('./config/redis');
        //seed        = require('./config/seed');




    mongoose.createMongooseConnection(function () {
        var app = express.init();
        app.listen(config.server.port, config.server.ip, function () {
            logger.info('Nodejs ' + process.version + ' en la interfaz: ' + config.ip_node + ':' + config.port_node);
            logger.info('Plataforma: ' + process.env.PLATFORM + '; Entorno: ' + process.env.NODE_ENV + '; Ruta desde la que se ejecuta: ' + process.cwd());
        });

    });
}

