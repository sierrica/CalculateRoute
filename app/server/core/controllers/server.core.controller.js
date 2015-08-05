var acceptLanguage = require('accept-language');


/* Render the main applicaion page */
exports.renderIndex = function(req, res) {
    //console.log ("user-agent: " + req.headers["user-agent"]);
    //console.log ("user-agent: " + req.headers["accept-language"]);
    var languages_req = acceptLanguage.parse (req.headers["accept-language"]);
    var language_prefered = languages_req[0];
    if (language_prefered.language == "es"  &&  !language_prefered.region)
        language_prefered.region = "ES";
    else if (language_prefered.language == "en"  &&  !language_prefered.region)
        language_prefered.region = "UK";
    //console.log (languages_req);

    res.render ('index', {
        lang: language_prefered.language + "-" + language_prefered.region
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
