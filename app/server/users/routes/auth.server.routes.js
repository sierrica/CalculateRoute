var path   = require ('path'),
    authentication = require (path.resolve('./app/server/users/controllers/users.server.controller'));

function setAuthenticationRoutes(app) {
    app.route ('/auth/signin').post (authentication.signin);
    app.route ('/auth/signout').get (authentication.signout);
    app.route ('/auth/signup').post (authentication.signup);
}

module.exports = setAuthenticationRoutes;