var mongoose = require('mongoose');
var config   = require('./config');

module.exports.createMongooseConnection = function(callback) {
    // create the database connection
    mongoose.connect(config.mongodb.dbURI, config.mongodb.dbOptions);

    // when successfully connected
    mongoose.connection.on('connected', function () {
        logger.info('Mongoose connected to ' + config.mongodb.dbURI);
    });

    // if the connection throws an error
    mongoose.connection.on('error', function (err) {
        logger.error('Mongoose connection error: ' + err);
    });

    // when the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        logger.info('Mongoose disconnected');
    });

    // when the connection is open , callback
    mongoose.connection.once('open', function () {
        if(callback && typeof(callback) === 'function') {
            callback();
        }
    });

    // if the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            logger.info('Se cerro la conexion a la base de datos debido a que se apago el servidor Node');
            process.exit(0);
        });
    });
};

