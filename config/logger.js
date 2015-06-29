var logger = require ('winston'),
    Loggly = require('winston-loggly').Loggly,
    Papertrail = require('winston-papertrail').Papertrail;

/* NIVELES PERSONALIZADOS */
logger.setLevels ({ DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 });
logger.addColors ({ DEBUG: "blue", INFO: "green", WARN: "yellow", ERROR: "red" });

/* INTEGRAR CON MORGAN */
logger.stream = {
    write: function (message, encoding) {
        logger.DEBUG (message);
    }
};

/* NO SALIR DEL PROGRAMA ANTE UN ERROR AL MANEJAR CON WINSTON LAS EXCEPCIONES (handleExceptions: true) */
logger.exitOnError = false;

/* BORRAR EL TRANSPORT Console QUE EXISTE POR DEFECTO */
logger.remove (logger.transports.Console);

/* TRANSPORT Console*/
logger.add (logger.transports.Console, {
    level: "DEBUG",
    colorize: true,
    handleExceptions: true
});

/* SOLO EN DESARROLLO O RASPBIAN */
if (process.env.PLATFORM == "raspberry"  ||  process.env.NODE_ENV == "development") {
    logger.add (logger.transports.DailyRotateFile, {
        level: "INFO",
        filename: "logs/calculateroute.log",
        maxsize: 1024 * 1024 * 10,
        maxFiles: 7,
        json: true,
        handleExceptions: true
    });
};

/*
logger.add (logger.transports.Loggly, {
    level: "INFO",
    json: true,
    subdomain: "sierrica",
    inputToken: "0839fb77-3b27-410d-93b8-9b71ba2f4d1d",
    auth: {
        username: "sierrica",
        password: "taustemix8888"
    },
    handleExceptions: true
});

logger.add (logger.transports.Papertrail, {
    level: "INFO",
    json: true,
    host: "logs3.papertrailapp.com",
    hostname: "windows",
    program: "calculateroute",
    port: 15605,
    colorize: true,
    handleExceptions: true
});
 */


/* NO FUNCIONA, MIRAR
logger.add (logger.transports.Logentries, {
    token: "1a3787d5-8a37-4838-8c84-37674c731143"
});
*/

module.exports = logger;
