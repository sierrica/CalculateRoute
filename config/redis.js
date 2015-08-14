var redis   = require ('redis'),
    config  = require ('./config'),
    logger  = require ('./logger');


var options = {
    auth_pass: 'tauste'
};

var redisClient = redis.createClient (config.redis.port, config.redis.ip, options);

redisClient.on ('connect', function () {
    setTimeout (function(){
        logger.info ('Conectado al servidor Redis: ' + config.redis.ip + ':' + config.redis.port);
    }, 1000);
});

/*
process.on ('message', function(msg) {          //ESRCH
    if (msg == 'shutdown') {
        redisClient.unref();
        //process.exit(1);
    }
});
*/
/*
process.on ('ESRCH', function() {                                              //ESRCH
    redisClient.unref();
    process.exit(1);
});
*/
process.on ('SIGTERM', function() {                                              //ESRCH
    redisClient.unref();
    logger.info ('Desconectado al servidor Redis');
    //process.exit(1);
});


redisClient.on ('error', function (err) {
    logger.error ('ERROR al conectarse al servidor Redis: ' + config.url_mongo);
    //logger.error (err);
    //process.exit (1);
});

module.exports = redisClient;
