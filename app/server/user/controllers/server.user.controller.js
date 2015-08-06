var path        = require ('path'),
    passport    = require ('passport'),
    token       = require (path.resolve('./app/server/user/config/server.user.token')),
    User        = require (path.resolve('./app/server/user/models/server.user.model')),
    logger      = require (path.resolve('./config/logger'));


function signup(req, res) {
    User.findOne ({ email: req.body.email }, function(err, existingUser) {
        if (existingUser)
            return res.status(409).send ({ message: 'Email is already taken' });

        var user = new User ({
            email: req.body.email,
            password: req.body.password
        });
        user.save (function() {
            token.createToken ({ email: req.body.email }, function(res, err, token) {
                if (err) {
                    logger.error (err.message);
                    return res.status(400).send (err);
                }
                res.status(201).json ({ token: token });
            }.bind(null, res));
        });
    });
};

function signin (req, res) {

    User.findOne ({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Wrong email and/or password' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            token.createToken ({
                email: req.body.email
            }, function(res, err, token) {
                if (err) {
                    logger.error (err.message);
                    return res.status(400).send(err);
                }
                res.status(201).json ({token: token});
            }.bind(null, res));
        });
    });
};

module.exports = {
    signup: signup,
    signin: signin
};

/*
module.exports = {
    signin: signin,
    signout: signout,
    signup: signup,
    isAuthenticated: isAuthenticated
};
*/
