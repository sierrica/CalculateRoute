var path        = require ('path'),
    token       = require (path.resolve('./app/server/user/config/server.user.token')),
    User        = require (path.resolve('./app/server/user/models/server.user.model')),
    logger      = require (path.resolve('./config/logger'));






function signup (req, res) {
    User.findOne ({ email: req.body.email }, function(err, existingUser) {
        if (existingUser)
            return res.status(401).json ({ message: 'email is already taken' });
        var user = new User ({
            email: req.body.email,
            password: req.body.password,
            lang: req.body.lang,
            rol: 'user'
        });
        user.save (function() {
            token.createToken (user, function(res, err, token) {
                if (err) {
                    //user.delete();
                    logger.error (err.message);
                    return res.status(400).send (err);
                }
                res.status(201).json ({ token: token });
            }.bind(null, res));
        });
    });
};

function login (req, res) {
    User.findOne ({ email: req.body.email }, '+password', function(err, user) {
        if (! user)
            return res.status(401).send ({ message: 'wrong email and/or password' });
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'wrong email and/or password' });
            }
            console.log (user);
            token.createToken (user, function(res, err, token) {
                if (err) {
                    logger.error (err.message);
                    return res.status(400).send(err);
                }
                res.status(201).json ({ token: token });
            }.bind(null, res));
        });
    });
};


function isAuthenticated(req, res, next) {
    console.log ("HEADERS");
    console.log (req.headers);

    console.log ("FIN HEADERS");
    token.verifyToken(req.headers, function(next, err, data) {
        if (err) {
            logger.error (err.message);
            return res.status(409).send (err.message);
        }
        req.user = data;

        next();
    }.bind(null, next));
}


function me (req, res) {
    res.status(200).json ({ user: req.user });
};


module.exports = {
    signup: signup,
    login: login,
    isAuthenticated: isAuthenticated,
    me: me
};
