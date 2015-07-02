var redis =     require ('redis'),
    config =    require ('./config')
    logger =        require ('./logger');


var options = {
    auth_pass: 'tauste'
};

var redisClient = redis.createClient (config.redis.port, config.redis.ip, options);

redisClient.on ('connect', function () {
    logger.info ('Conectado al servidor Redis: ' + config.redis.ip + ':' + config.redis.port);
});

redisClient.on ('error', function (err) {
    logger.error ('ERROR al conectarse al servidor Redis: ' + config.url_mongo);
    logger.error (err);
    process.exit (1);
});

module.exports = redisClient;
