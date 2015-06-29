var config = require('./config/config'),
    express = require('./config/express'),
    path = require('path'),
    chalk = require('chalk'),
    mongoose = require ("mongoose");
    chalk = require('chalk'),
    logger = require('./config/logger');






/*
var database = mongoose.connect(config.url_mongo, function (err) {
    if (err) {
        logger.ERROR('Imposible conectarse a la Base de datos: ' + config.url_mongo);
        logger.ERROR(err);
        process.exit(1);
    }
    else {
        logger.INFO("Conectado a la base de datos: " + config.url_mongo);
        var app = express.init();
        app.listen(config.port_node, config.ip_node, function () {
            logger.INFO('Escuchando Nodejs ' + process.version + ' en la interfaz: ' + config.ip_node + ':' + config.port_node);
            logger.INFO('Plataforma: ' + process.env.PLATFORM + '; Entorno: ' + process.env.NODE_ENV + '; Ruta desde la que se ejecuta: ' + process.cwd());
        });

        app.get('/', function (req, res) {
            res.render('index', app.locals);
        });
    }
});
*/
