var sys = require('sys'),
    exec = require('child_process').exec;
//    replace = require("replace")
//    mv = require ('mv');


function puts(error, stdout, stderr) { sys.puts(stdout) };


// Instalar Bower dependiendo de la plataforma
if (process.env.PLATFORM == "openshift")
    exec("HOME=$OPENSHIFT_DATA_DIR bower install", puts);
else
    exec("bower install", puts);





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
