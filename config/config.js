
var _           = require ('lodash'),
    path        = require ('path'),
    glob        = require ('glob'),
    chalk       = require ('chalk'),
    fs          = require ('fs'),
    UglifyJS    = require ("uglify-js"),
    uglifycss   = require ('uglifycss')
    logger      = require ('./logger');




/**
 * Get files by glob patterns
 */
function getGlobbedPaths(globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function(file) {
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            file = file.replace(excludes[i], '');
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }
    return output;
}




var initGlobalConfigFiles = function(config) {

    // Appending files
    config.files = {
        server: {},
        client: {}
    };

    // Setting Globbed model files
    config.files.server.models = getGlobbedPaths(config.assets.server.models);

    // Setting Globbed route files
    config.files.server.routes = getGlobbedPaths(config.assets.server.routes);

    // Setting Globbed config files
    config.files.server.configs = getGlobbedPaths(config.assets.server.config);


    if (process.env.NODE_ENV === 'production') {
        var css_min = uglifycss.processFiles (getGlobbedPaths(config.assets.client.lib.css).concat(getGlobbedPaths(config.assets.client.css)), {
            maxLineLen: 500,
            expandVars: true
        });
        fs.writeFileSync ('app/client/lib/calculateroute.css', css_min);
        config.files.client.css = getGlobbedPaths('app/client/lib/calculateroute.css', 'app/client/');

        var js_min = UglifyJS.minify (getGlobbedPaths(config.assets.client.lib.js).concat(getGlobbedPaths(config.assets.client.js)), {
            mangle: false
        });
        fs.writeFileSync ('app/client/lib/calculateroute.js', js_min.code);
        config.files.client.js = getGlobbedPaths('app/client/lib/calculateroute.js', 'app/client/');
    }
    else {
        config.files.client.css = getGlobbedPaths(config.assets.client.lib.css, 'app/client/').concat(getGlobbedPaths(config.assets.client.css, 'app/client/'));
        config.files.client.js = getGlobbedPaths(config.assets.client.lib.js, 'app/client/').concat(getGlobbedPaths(config.assets.client.js, 'app/client/'));
    }
};

/* Initialize global configuration files */
var initGlobalConfigFolders = function(config) {
    // Appending files
    config.folders = {
        server: {},
        client: {}
    };

    // Setting globbed client paths
    config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'app/client/'), process.cwd().replace(new RegExp(/\\/g),'/'));
};




var initGlobalConfig = function() {

    // Get the default config
    var defaultConfig = require(path.join(process.cwd(), '/config/env/default'));

    // Get the current config
    var environmentConfig = require(path.join(process.cwd(), 'config/env/',"development"));

    // Merge config files
    var config = _.extend(defaultConfig, environmentConfig);


    initGlobalConfigFiles(config);

    // Initialize global globbed folders
    initGlobalConfigFolders(config);




    // Expose configuration utilities
    config.utils = {
        getGlobbedPaths: getGlobbedPaths
    };






    return config;

};







module.exports = initGlobalConfig();