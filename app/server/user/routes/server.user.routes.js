var path = require ('path'),
    user = require ('../controllers/server.user.controller');

module.exports = function(app) {

    app.route ('/signup').post (user.signup);
    app.route ('/login').post (user.login);
    app.route ('/forgot').post (user.forgot);
    app.route ('/me')
        .get (user.isAuthenticated, user.me)
        .put (user.isAuthenticated, user.update);


};