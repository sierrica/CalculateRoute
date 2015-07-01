var config = require('./config/config'),
    express = require('./config/express'),

    path = require('path'),
    chalk = require('chalk'),
    mongoose = require ("./config/mongoose"),
    chalk = require('chalk'),
    logger = require('./config/logger');


mongoose.createMongooseConnection (function(db) {
    var app = express.init();
    app.listen(config.server.port, config.server.ip, function () {
        logger.info('Escuchando Nodejs ' + process.version + ' en la interfaz: ' + config.ip_node + ':' + config.port_node);
        logger.info('Plataforma: ' + process.env.PLATFORM + '; Entorno: ' + process.env.NODE_ENV + '; Ruta desde la que se ejecuta: ' + process.cwd());
    });

    app.get('/', function (req, res) {
        res.render('index', app.locals);
    });
});


