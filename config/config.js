var _           = require ('lodash'),
    path        = require ('path'),
    glob        = require ('glob'),
    chalk       = require ('chalk'),
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
        config.files.client.css = getGlobbedPaths('files/calculateroute.min.css', 'files/');
        config.files.client.js = getGlobbedPaths('files/calculateroute.min.js', 'files/');
   }
   else {
        config.files.client.css = getGlobbedPaths(config.assets.client.lib.css, 'files/').concat(getGlobbedPaths(config.assets.client.css, 'files/'));
        config.files.client.js = getGlobbedPaths(config.assets.client.lib.js, 'files/').concat(getGlobbedPaths(config.assets.client.js, 'files/'));
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
    config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'app/client/'), process.cwd().replace(new RegExp(/\\/g),'/'))
                    .concat(getGlobbedPaths(path.join(process.cwd(), 'files/'), process.cwd().replace(new RegExp(/\\/g),'/')));
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
