var mongoose =  require ('mongoose'),
    config =    require ('./config'),
    logger =    require ('./logger');

module.exports.createMongooseConnection = function (callback) {

//  mongoose.connect (config.mongodb.url, { server: { poolSize: 1 }});
    mongoose.connect (config.mongodb.url);

    mongoose.connection.on ('connected', function () {
        setTimeout (function(){
            logger.info ('Conectado a la base de datos: ' + config.mongodb.url);
        }, 1000);
    });

    mongoose.connection.on ('disconnected', function () {
        logger.warn ('Desconectado de la base de datos: ' + config.mongodb.url);
    });

    mongoose.connection.once ('open', function () {
        if(callback && typeof(callback) === 'function') {
            callback ();
        }
    });

    mongoose.connection.on ('error', function (err) {
        logger.error ('ERROR al conectarse a la Base de datos: ' + config.mongodb.url);
        logger.error (err);
        process.exit (1);
    });

    // if the Node process ends, close the Mongoose connection
    process.on ('SIGTERM', function() {
        mongoose.connection.close (function () {
            /*  */
            logger.info ('Se cerro la conexion a la base de datos debido a que se apago el servidor Node');
            process.exit (1);
        });
    });
};
