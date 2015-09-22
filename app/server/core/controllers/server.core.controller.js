var detectBrowser = function() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
};



exports.renderIndex = function(req, res) {
    //console.log ("user-agent: " + req.headers["user-agent"]);

    if (req.headers["accept-language"]) {
        console.log ("user-agent: " + req.headers["accept-language"])
        var language_prefered = req.headers["accept-language"].split(",")[0];
        var lang = language_prefered.split("-")[0];
        var region = language_prefered.split("-")[1];
        if (lang == "es"  &&  (region=="undefined" || region != "ES"))
            region = "ES";
        else if (lang == "en"  &&  (region=="undefined" || region != "GB"))
            region = "GB";
        else if (lang == "de"  &&  (region=="undefined" || region != "DE"))
            region = "DE";
        else {
            lang = "es";
            region = "ES";
        }
    }
    else {
        lang = "es";
        region = "ES";
    }
    console.log ("LANG-DEF: " + lang + "-" + region)

    res.render ('index', {
        country: lang,
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
