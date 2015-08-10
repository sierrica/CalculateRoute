var path = require ('path'),
    user = require ('../controllers/server.user.controller');

module.exports = function(app) {

    app.route ('/signup').post (user.signup);
    app.route ('/login').post (user.login);

    app.route ('/me').get (user.isAuthenticated, user.me);

};