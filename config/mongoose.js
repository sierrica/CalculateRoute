var mongoose =  require ('mongoose'),
    config =    require ('./config'),
    logger =    require ('./logger');

module.exports.createMongooseConnection = function (callback) {

    var database = mongoose.connect (config.mongodb.url);

    mongoose.connection.on ('connected', function () {
        logger.info ('Conectado a la base de datos: ' + config.url_mongo);
    });

    mongoose.connection.on ('disconnected', function () {
        logger.warn ('Desconectado de la base de datos: ' + config.url_mongo);
    });

    mongoose.connection.once ('open', function () {
        if(callback && typeof(callback) === 'function') {
            callback (database);
        }
    });

    mongoose.connection.on ('error', function (err) {
        logger.error ('Imposible conectarse a la Base de datos: ' + config.url_mongo);
        logger.error (err);
        process.exit (1);
    });

    // if the Node process ends, close the Mongoose connection
    process.on ('SIGINT', function() {
        mongoose.connection.close (function () {
            logger.info ('Se cerro la conexion a la base de datos debido a que se apago el servidor Node');
            process.exit (0);
        });
    });
};