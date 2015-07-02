
var path        = require ('path'),
    passport    = require ('passport'),
    User        = require (path.resolve('./app/server/users/models/user.server.model')),
    config      = require (path.resolve('./config/config'));

module.exports = function(app) {

    // Initialize strategies
    config.utils.getGlobbedPaths (path.join(__dirname, './strategies/**/*.js')).forEach(function(strategy) {
        require (path.resolve(strategy))(User, config);
    });

    // Add passport's middleware
    app.use (passport.initialize());

    logger.debug ("DENTRO");
};
