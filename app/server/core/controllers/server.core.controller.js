/* Render the main applicaion page */
exports.renderIndex = function(req, res) {
    //console.log ("user-agent: " + req.headers["user-agent"]);

    console.log (req.headers["accept-language"].split(",")[0]);
    var language_prefered = req.headers["accept-language"].split(",")[0];
    var lang = language_prefered.split("-")[0];
    var region = language_prefered.split("-")[1];
    if (lang == "es"  &&  (!region || region != "ES"))
        region = "ES";
    else if (lang == "en"  &&  (!region || region != "GB"))
        region = "GB";

    res.render ('index', {
        lang: lang + "-" + region
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
