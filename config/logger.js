var cluster = require('cluster'),
    logger = require ('winston'),
    //Loggly = require('winston-loggly').Loggly,
    Papertrail = require('winston-papertrail').Papertrail;

/* NIVELES PERSONALIZADOS */
logger.setLevels ({ debug: 0, info: 1, warn: 2, error: 3 });
logger.addColors ({ debug: 'blue', info: 'green', warn: 'yellow', error: 'red' });

/* NO SALIR DEL PROGRAMA ANTE UN ERROR AL MANEJAR CON WINSTON LAS EXCEPCIONES (handleExceptions: true) */
logger.exitOnError = true;

/* BORRAR EL TRANSPORT Console QUE EXISTE POR DEFECTO */
logger.remove (logger.transports.Console);




/* TRANSPORT Console*/
logger.add (logger.transports.Console, {
    level: "debug",
    colorize: true,
    label: 'calculateroute-' + process.env.pm_id,
    handleExceptions: false

});

/* SOLO EN DESARROLLO O RASPBIAN */
/*
if (process.env.PLATFORM == "raspberry"  ||  process.env.NODE_ENV == "development") {
    logger.add (logger.transports.DailyRotateFile, {
        level: "info",
        filename: "logs/calculateroute.log",
        maxsize: 1024 * 1024 * 10,
        maxFiles: 7,
        json: true,
        handleExceptions: true
    });
};
*/
/*
logger.add (logger.transports.Loggly, {
    level: "info",
    json: true,
    subdomain: "sierrica",
    inputToken: "0839fb77-3b27-410d-93b8-9b71ba2f4d1d",
    auth: {
        username: "sierrica",
        password: "taustemix8888"
    },
    handleExceptions: true
});
 */
if (process.env.PLATFORM == 'openshift'  ||  process.env.PLATFORM == 'heroku') {
    logger.add (logger.transports.Papertrail, {
        level: 'info',
        json: true,
        hostname: process.env.PLATFORM,
        program: 'calculateroute-' + process.env.pm_id,
        host: 'logs3.papertrailapp.com',
        port: 15605,
        colorize: true,
        handleExceptions: false
    });

}


logger.info(cluster.worker);


/* NO FUNCIONA, MIRAR
logger.add (logger.transports.Logentries, {
    token: "1a3787d5-8a37-4838-8c84-37674c731143"
});
*/

module.exports = logger;