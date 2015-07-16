var path        = require ('path'),
    fs          = require ('fs'),
    uglifyjs    = require ("uglify-js"),
    uglifycss   = require ('uglifycss'),
    config     = require (path.join(process.cwd(), '/config/config'))
    sys = require('sys'),
    exec = require('child_process').exec;



function puts(error, stdout, stderr) { sys.puts(stdout) };


// Instalar Bower dependiendo de la plataforma
if (process.env.PLATFORM == "openshift")
    exec("HOME=$OPENSHIFT_DATA_DIR bower install", puts);
else
    exec("bower install", puts);



console.log ("DENTRO");

    console.log ("DENTRO IF");
    var css_min = uglifycss.processFiles (config.utils.getGlobbedPaths(config.assets.client.lib.css).concat(config.utils.getGlobbedPaths(config.assets.client.css)), {
        maxLineLen: 500,
        expandVars: true
    });
    fs.writeFileSync (path.join(process.cwd(), '/app/client/lib/calculateroute.min.css'), css_min);

    var js_min = uglifyjs.minify (config.utils.getGlobbedPaths(config.assets.client.lib.js).concat(config.utils.getGlobbedPaths(config.assets.client.js)), {
        mangle: false
    });
    fs.writeFileSync (path.join(process.cwd(), '/app/client/lib/calculateroute.min.js'), js_min.code);

