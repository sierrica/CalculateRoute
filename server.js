var config      = require ('./config/config'),
    express     = require ('./config/express'),
    mongoose    = require ('./config/mongoose'),
    logger      = require ('./config/logger'),
    redis       = require ('./config/redis');
    //seed        = require('./config/seed');




//mongoose.createMongooseConnection(function () {
    var app = express.init();
    app.listen(config.server.port, config.server.ip, function () {
        setTimeout (function(){
            logger.info('PLATFORM: ' + process.env.PLATFORM + '; NODE_ENV: ' + process.env.NODE_ENV + '; INTERFACE: ' + config.ip_node + ':' + config.port_node + '; NODEJS -V: ' + process.version);
        }, 1000);
    });

//});
