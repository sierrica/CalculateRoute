var redis =     require ('redis'),
    config =    require ('./config')
    logger =        require ('./logger');


var opciones_redis = {
    auth_pass: "tauste"
};

var redisClient = redis.createClient (config.redis.port, config.redis.ip, opciones_redis);

redisClient.on ('connect', function () {
    logger.info ('Conectado al servidor Redis: ' + config.redis.ip + ':' + config.redis.port);
});

redisClient.on ('error', function (err) {
    logger.error ('Redis error: ' + err);
});

module.exports = redisClient;