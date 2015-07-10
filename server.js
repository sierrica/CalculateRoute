var cluster     = require ('cluster');


if (cluster.isMaster) {
    // Fork workers.
    var numCPUs = require('os').cpus().length;
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }



    Object.keys(cluster.workers).forEach(function(id) {
        console.log("I am running with ID : "+ cluster.workers[id].process.pid);
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log ('worker ' + worker.process.pid + ' died');
        console.log('restarting Process...');
        cluster.fork();
    });
}
else {
    var config      = require ('./config/config'),
        express     = require ('./config/express'),
        mongoose    = require ('./config/mongoose'),
        logger      = require ('./config/logger'),
        redis       = require ('./config/redis');
        //seed        = require('./config/seed');

        mongoose.createMongooseConnection (function() {
            var app = express.init();
            app.listen (config.server.port, config.server.ip, function () {
                logger.info ('Escuchando Nodejs ' + process.version + ' en la interfaz: ' + config.ip_node + ':' + config.port_node);
                logger.info ('Plataforma: ' + process.env.PLATFORM + '; Entorno: ' + process.env.NODE_ENV + '; Ruta desde la que se ejecuta: ' + process.cwd());
            });
        });
}



