var config      = require ('./config/config'),
    express     = require ('./config/express'),
    mongoose    = require ('./config/mongoose'),
    logger      = require ('./config/logger'),
    redis       = require ('./config/redis');
    //seed        = require('./config/seed');

mongoose.createMongooseConnection(function () {
    var app = express.init();
    app.listen(config.server.port, config.server.ip, function () {
        setTimeout (function(){
            logger.info('Nodejs ' + process.version + ' en la interfaz: ' + config.ip_node + ':' + config.port_node);
            logger.info('Plataforma: ' + process.env.PLATFORM + '; Entorno: ' + process.env.NODE_ENV + '; Ruta desde la que se ejecuta: ' + process.cwd());
        }, 3000);
    });

});