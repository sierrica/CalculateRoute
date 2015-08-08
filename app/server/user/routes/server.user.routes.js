module.exports = function(app) {
    var users = require ('../controllers/server.user.controller');

    app.route ('/signup').post (users.signup);
    app.route ('/login').post (users.login);
};