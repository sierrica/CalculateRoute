var _           = require ('lodash'),
    path        = require ('path'),
    token       = require (path.resolve('./app/server/user/config/server.user.token')),
    User        = require (path.resolve('./app/server/user/models/server.user.model')),
    logger      = require (path.resolve('./config/logger')),
    nodemailer  = require ('nodemailer'),
    sgTransport = require ('nodemailer-sendgrid-transport'),
    randomstring = require ("randomstring");






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
            res.status(201).json ({ message: 'properly registered' });
        }.bind(null, res));
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


function forgot (req, res) {
    User.findOne ({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            var password = randomstring.generate(7);
            var options = { auth: { api_user: 'sierrica', api_key: 'taustemix8888' } };
            var mailer = nodemailer.createTransport (sgTransport(options));
            var email = {
                to: [req.body.email],
                from: 'sierrica@ptv_email.sierrica.com',
                subject: 'forgot password',
                text: 'Su nueva contrasena es: ',
                html: '<b>Su nueva contrasena es: </b>'
            };
            mailer.sendMail(email, function(err, result) {
                if (err)
                    return res.status(200).send (err);
                console.log (result);
                res.status(200).send (result);
            });
        }
        else
            res.status(200).send ("");
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
};


function me (req, res) {
    res.status(200).json ({ user: req.user });
};

function update(req, res, next) {
    User.findById (req.user._id, function (err, user) {
        if (err)
            return res.status(400).send ( err );
        user.email = req.body.email;
        user.password = req.body.password;
        user.lang = req.body.lang;
        user.save (function (err) {
            if (err)
                return res.status(400).send (err);
            res.status(201).send (user);
        });
    });
};


module.exports = {
    signup: signup,
    login: login,
    forgot: forgot,
    isAuthenticated: isAuthenticated,
    me: me,
    update: update
};
