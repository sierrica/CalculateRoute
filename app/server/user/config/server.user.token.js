var path   = require ('path'),
    jwt    = require ('jsonwebtoken'),
    redis  = require (path.resolve('./config/redis')),
    config = require (path.resolve('./config/config'));


function extractTokenFromHeader(headers) {

    if (headers == null)
        throw new Error ('Header is null');

    if (headers.authorization == null)
        throw new Error ('Authorization header is null');

    var authorization = headers.authorization;

    var authArr = authorization.split(' ');

    if (authArr.length !== 2)
        throw new Error('Authorization header value is not of length 2');

    var token = authArr[1];
    try {
        jwt.verify (token, config.token.secret);
    }
    catch(err) {
        throw new Error('The token is not valid');
    }
    return token;
};


function createToken (user, payload, cb) {
    var ttl = config.token.ttl;

    if (payload != null && typeof payload !== 'object')
        return cb (new Error('payload is not an Object'));

    if (ttl != null  &&  typeof ttl !== 'number')
        return cb (new Error('ttl is not a valid Number'));

    var token = jwt.sign (payload, config.token.secret, { expiresInMinutes: ttl });

    // stores a token with payload data for a ttl period of time
    redis.setex (token, ttl, JSON.stringify(user), function(token, err, reply) {
        if (err)
            return cb (err);
        else if (reply)
            cb (null, token);
        else
            cb (new Error('Token not set in Redis'));
    }.bind (null, token));
};


function expireToken(headers, cb) {
    try {
        var token = extractTokenFromHeader (headers);
        if (token == null)
            return cb (new Error('Token is null'));
        redis.del (token, function(err, reply) {                 // delete token from redis. reply -> OK
            if (err)
                return cb (err);
            if ( ! reply)
                return cb (new Error('Token not found'));
            return cb (null, true);
        });
    }
    catch (err) {
        return cb (err);
    }
};

function verifyToken(headers, cb) {
    try {
        var token = extractTokenFromHeader (headers);
        if (token == null)
            return cb (new Error('Token is null'));
        redis.get (token, function(err, userData) {               // gets the associated data of the token
            if (err)
                return cb (err);
            if ( ! userData)
                return cb (new Error('Token not found'));
            return cb (null, JSON.parse(userData));
        });
    }
    catch (err) {
        return cb (err);
    }
};

module.exports = {
    extractTokenFromHeader: extractTokenFromHeader,
    createToken: createToken,
    expireToken: expireToken,
    verifyToken: verifyToken
};
