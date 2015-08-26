var path = require ('path'),
    user = require (path.resolve('./app/server/user/controllers/server.user.controller')),
    ptv  = require ('../controllers/server.ptv.controller');

module.exports = function(app) {
    app.route ('/ptv/findaddress').post (user.isAuthenticated, ptv.findaddress);
    app.route ('/ptv/findlocation').post (user.isAuthenticated, ptv.findlocation);
    app.route ('/ptv/calculateroute').post (user.isAuthenticated, ptv.calculateroute);
};