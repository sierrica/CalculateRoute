var redis =     require ('redis'),
    config =    require ('./config');


var redisClient = redis.createClient (config.redis.port, config.redis.ip);

redisClient.on ('connect', function () {
    logger.info ('Conectado al servidor Redis: ' + config.redis.host + ':' + config.redis.port);
});

redisClient.on ('error', function (err) {
    logger.error ('Redis error: ' + err);
});

module.exports = redisClient;