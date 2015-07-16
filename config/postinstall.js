var config      = require ('config'),
    fs          = require ('fs'),
    uglifyjs    = require ("uglify-js"),
    uglifycss   = require ('uglifycss');




if (process.env.NODE_ENV === 'production') {
    var css_min = uglifycss.processFiles (getGlobbedPaths(config.assets.client.lib.css).concat(getGlobbedPaths(config.assets.client.css)), {
        maxLineLen: 500,
        expandVars: true
    });
    fs.writeFileSync ('../app/client/lib/calculateroute.css', css_min);

    var js_min = uglifyjs.minify (getGlobbedPaths(config.assets.client.lib.js).concat(getGlobbedPaths(config.assets.client.js)), {
        mangle: false
    });
    fs.writeFileSync ('../app/client/lib/calculateroute.js', js_min.code);
}









//    replace = require("replace")
//    mv = require ('mv');









/* YA NO ES NECESARIO */
// 1º opcion: instalar mongooseinstaller que instala bson y mongoose y realiza por dentro la 2º opcion

// 2º opcion: Instalar bson y mover el directorio de bson a donde lo tiene especificado en el fich index.js
/*mv('node_modules/bson', 'node_modules/mongoose/node_modules/mongodb/node_modules/mongodb-core/node_modules', function(err) {
    console.log (err);
    if (err)
        console.log ("NO se ha podido mover la carpeta node_modules/bson requerida para mongoose");
    else
        console.log ("SI se ha movido la carpeta node_modules/bson requerida para mongoose");
});

// 3º opcion: Cambio en el fichero index.js la ruta donde esta definido bson. Utilizo el que viene dentro de mongoose y no el paquete bson"../build/Release/bson" por "bson"
/*replace({
    regex: "../build/Release/bson",
    replacement: "bson",
    paths: ['./node_modules/mongoose/node_modules/bson/node_modules/bson-ext/ext/index.js'],
    recursive: true,
    silent: true
}); */
