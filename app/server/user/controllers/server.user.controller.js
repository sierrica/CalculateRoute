var _               = require ('lodash'),
    path            = require ('path'),
    token           = require (path.resolve('./app/server/user/config/server.user.token')),
    User            = require (path.resolve('./app/server/user/models/server.user.model')),
    Ptv             = require (path.resolve('./app/server/ptv/models/server.ptv.model')),
    logger          = require (path.resolve('./config/logger')),
    nodemailer      = require ('nodemailer'),
    sgTransport     = require ('nodemailer-sendgrid-transport'),
    randomstring    = require ("randomstring");






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
            var ptv_defaults = new Ptv ({ _id: user._id });
            ptv_defaults.save (function (err) {
                res.status(201).json ({ message: 'properly registered' });
            });
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
            var random_password = randomstring.generate(6);
            existingUser.password = random_password;
            existingUser.save (function (err) {
               if (err)
                   return res.status(400).send (err);
                // tengo que crear un addon en heroku para que me deje instalar el module nodemailer, pero como solo puedo tener en sendgrid un dominio, utilizo el mismo en todos lados

                var options =   process.env.PLATFORM == 'openshift'  ? { auth: { api_user: 'XXXXX', api_key: 'XXXXXXX' } } :
                                process.env.PLATFORM == 'heroku'     ? { auth: { api_user: 'XXXXX', api_key: 'XXXXXXX' } } :     // utilizo el mismo
                                                                       { auth: { api_user: 'XXXXXX', api_key: 'XXXXXXXX' } };       //heroku addon
                var from =  process.env.PLATFORM == 'openshift'  ?  'XXXXXXXX' :
                            process.env.PLATFORM == 'heroku'     ?  'XXXXXXX' :         // utilizo el mismo
                                                                    'XXXXXXXXX';
                var subject =   existingUser.lang == 'es-ES'  ?  'Contraseña perdida Calculateroute' :
                                existingUser.lang == 'en-GB'  ?  'Forgot password Calculateroute' :
                                                                 'Forgot password Calculateroute';
                var text =      existingUser.lang == 'es-ES'  ?  'Tu nueva contraseña es: ' +  random_password :
                                existingUser.lang == 'en-GB'  ?  'Your new password is: ' + random_password :
                                                                 'Your new password is: ' + random_password;
                var mailer = nodemailer.createTransport (sgTransport(options));
                var email = {
                    to: [req.body.email],
                    from: from,
                    subject: subject,
                    text: text,
                    html: '<b>' + text + '</b>'
                };
                mailer.sendMail(email, function(err, result) {
                    if (err)
                        return res.status(200).send (err);
                    res.status(200).send (result);
                });
            });
        }
        else
            res.status(200).send ("");                                  // envio como satisfactorio para evitar que se identifiquen los emails registrados
    });
};


function isAuthenticated(req, res, next) {
    //console.log ("HEADERS");
    //console.log (req.headers);

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
    //console.log ("ME");
    //console.log (req.user);
    res.status(200).json ({ user: req.user });
};

function myoptions (req, res) {
    Ptv.findById (req.user._id, function (err, options) {
        if (err)
            return res.status(400).send ( err );
        res.status(200).json ({ options: options });
    });
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
            token.createToken (user, function(res, err, token) {
                if (err) {
                    logger.error (err.message);
                    return res.status(400).send(err);
                }
                res.status(201).json ({ access_token: token, user: user });
            }.bind(null, res));
        });
    });
};


module.exports = {
    signup: signup,
    login: login,
    forgot: forgot,
    isAuthenticated: isAuthenticated,
    me: me,
    myoptions: myoptions,
    update: update
};
