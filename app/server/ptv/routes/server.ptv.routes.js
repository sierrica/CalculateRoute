module.exports = function(app) {
    // Root routing
    var ptv = require ('../controllers/server.ptv.controller');

    // Define error pages
    app.route ('/ptv/calculateroute')
        .post (ptv.calculateroute);

};