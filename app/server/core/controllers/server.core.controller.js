/* Render the main applicaion page */
exports.renderIndex = function(req, res) {
    //console.log ("user-agent: " + req.headers["user-agent"]);

    console.log (req.headers["accept-language"]);
    console.log (req.headers["accept-language"]);
    //logger.info (req.headers["accept-language"]);
    if (req.headers["accept-language"]) {
        console.log (req.headers["accept-language"])
        var language_prefered = req.headers["accept-language"].split(",")[0];
        console.log (language_prefered);
        var lang = language_prefered.split("-")[0];
        console.log (lang);
        var region = language_prefered.split("-")[1];
        console.log (region);
        if (lang == "es"  &&  (!region || region != "ES"))
            region = "ES";
        else if (lang == "en"  &&  (!region || region != "GB"))
            region = "GB";
        }
    else {
        lang = "es"; region = "ES";
    }

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
