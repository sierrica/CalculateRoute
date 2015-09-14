var config          = require ('./config'),
    logger          = require ('./logger'),
    express         = require ('express'),
    path            = require ('path'),
    consolidate     = require ('consolidate'),
    helmet          = require ('helmet'),
    cors            = require ('cors'),
    bodyParser      = require ('body-parser'),
    multer          = require ('multer'),
    favicon         = require ('serve-favicon'),
    mongoose        = require ("mongoose"),
    morgan          = require ('morgan'),
    compression     = require ('compression'),
    errorHandler    = require ('errorhandler'),
    core = require (path.resolve('./app/server/core/controllers/server.core.controller'));


/* Invoke modules server configuration */
module.exports.initModulesConfiguration = function (app, db) {
    config.files.server.configs.forEach(function (configPath) {
        require (path.resolve(configPath))(app, db);
    });
};


/* Cabeceras Helmet (Seguridad cabeceras) */
module.exports.initHelmetHeaders = function (app) {
    app.use (helmet.xframe());
    app.use (helmet.xssFilter());
    app.use (helmet.nosniff());
    app.use (helmet.ienoopen());
    app.set ('x-powered-by', false);                // Disable header 'X-Powered-By ? Express'

};

/* Habilitar CORS */
module.exports.initCrossDomain = function(app) {
    app.use (cors());
    app.use (function(req, res, next) {
        res.set ('Access-Control-Allow-Origin', '*');
        res.set ('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        res.set ('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');
        next();
    });
};

/* Inicializar variables locales express */
module.exports.initLocalVariables = function (app) {
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.cssFiles = config.files.client.css;
    app.locals.jsFiles = config.files.client.js;
};

/* Initialize application middleware */
module.exports.initMiddleware = function (app) {
    app.use (favicon('files/images/favicon.png'));                                     // favicon
    app.set ('showStackError', true);
    app.enable ('jsonp callback');

    app.use (compression());

    app.use (bodyParser.json());                                                // for parsing application/json
    app.use (bodyParser.urlencoded({ extended: true }));                        // for parsing application/x-www-form-urlencoded
    //app.use (multer());                                                         // for parsing multipart/form-data

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
        app.use (morgan('dev', { stream: { write: function(str) { logger.debug(str); } }}));          // Habilitar Morgan a traves de winston.
        app.set('view cache', false);                                                                   // Disable views cache
        app.use(errorHandler()); // Error handler - has to be last
    }
    else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }
};

/* Establecer las vistas de express */
module.exports.initViewEngine = function (app) {
    app.engine ('view.html', consolidate.swig);
    app.set ('view engine', 'view.html');
    app.set ('views', 'app/server/core/views');
};

/* Configure the modules static routes */
module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folder
    app.use ('/', express.static(path.resolve('./app/client')));
    app.use ('/files', express.static(path.resolve('./files')));

    // Globbing static routing
    config.folders.client.forEach(function (staticPath) {
        app.use (staticPath.replace('/app/client', ''), express.static(path.resolve('./' + staticPath)));
        app.use (staticPath.replace('/files', ''), express.static(path.resolve('./' + staticPath)));

    });
};

/* Configure the modules server routes */
module.exports.initModulesServerRoutes = function (app) {
    config.files.server.routes.forEach (function (routePath) {
        require (path.resolve(routePath))(app);                                         // Globbing routing files
    });


};


module.exports.init = function () {
    var app = express();
    this.initLocalVariables(app);
    this.initMiddleware(app);
    this.initViewEngine(app);
    this.initCrossDomain(app);
    this.initHelmetHeaders(app);
    this.initModulesClientRoutes(app);
    this.initModulesServerRoutes(app);
    return app;
};