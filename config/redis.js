var redis =     require ('redis'),
    config =    require ('./config');

var redisClient = redis.createClient (config.redis.port, config.redis.host);

redisClient.on ('connect', function () {
    logger.info('Redis connected to ' + config.redis.host + ':' + config.redis.port);
});

redisClient.on ('error', function (err) {
    logger.error('Redis error: ' + err);
});

module.exports = redisClient;