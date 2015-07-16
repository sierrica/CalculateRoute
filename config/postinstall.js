var
    fs          = require ('fs'),
    uglifyjs    = require ("uglify-js"),
    uglifycss   = require ('uglifycss');







/*
if (process.env.NODE_ENV === 'production') {
    var css_min = uglifycss.processFiles (config.utils.getGlobbedPaths(config.assets.client.lib.css).concat(config.utils.getGlobbedPaths(config.assets.client.css)), {
        maxLineLen: 500,
        expandVars: true
    });
    fs.writeFileSync ('../app/client/lib/calculateroute.css', css_min);

    var js_min = uglifyjs.minify (config.utils.getGlobbedPaths(config.assets.client.lib.js).concat(config.utils.getGlobbedPaths(config.assets.client.js)), {
        mangle: false
    });
    fs.writeFileSync ('../app/client/lib/calculateroute.js', js_min.code);
}
*/
