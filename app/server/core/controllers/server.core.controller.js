var language_parser = require('accept-language-parser');


/* Render the main applicaion page */
exports.renderIndex = function(req, res) {
    //console.log ("user-agent: " + req.headers["user-agent"]);
    var languages_req = language_parser.parse (req.headers["accept-language"]);
    res.render ('index', {
        lang: languages_req[0].code
    });
};

/* Render the server error page */
exports.renderServerError = function(req, res) {
    res.status(500).render ('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

/* Render the server not found page */
exports.renderNotFound = function(req, res) {
    res.status(404).render('modules/core/server/views/404', {
        url: req.originalUrl
    });
};
