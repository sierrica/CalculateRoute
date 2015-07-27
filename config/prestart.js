var _           = require ('lodash'),
    path        = require ('path'),
    glob        = require ('glob'),
    fs          = require ('fs'),
    uglifyjs    = require ("uglify-js"),
    uglifycss   = require ('uglifycss'),
    config      = require ('./env/default');


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


console.log ("COMPRIMING CSS/JS................");
var css_min = uglifycss.processFiles (getGlobbedPaths(config.assets.client.lib.css).concat(getGlobbedPaths(config.assets.client.css)), {
    maxLineLen: 500,
    expandVars: true
});
fs.writeFileSync (path.join(process.cwd(), '/files/lib/calculateroute.min.css'), css_min);

var js_min = uglifyjs.minify (getGlobbedPaths(config.assets.client.lib.js).concat(getGlobbedPaths(config.assets.client.js)), {
    mangle: false
});
fs.writeFileSync (path.join(process.cwd(), '/files/lib/calculateroute.min.js'), js_min.code);

console.log ("CSS/JS COMPRESSED");

