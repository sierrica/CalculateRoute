var authentication = require ('../controllers/users.server.controller');


function setAuthenticationRoutes(app) {
    app.route ('/auth/signin').post (authentication.signin);
    app.route ('/auth/signout').get (authentication.signout);
    app.route ('/auth/signup').post (authentication.signup);
}

module.exports = setAuthenticationRoutes;