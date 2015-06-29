module.exports = {
    app: {
        title: 'calculateRoute',
        description: 'Calculador de Rutas',
        keywords: 'rutas, camiones'
    },
    ip_node: process.env.OPENSHIFT_NODEJS_IP ||"0.0.0.0",
    port_node: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT  || 80,
    url_mongo: (process.env.PLATFORM == "heroku") ? "mongodb://sierrica:taustemix8888@ds033400.mongolab.com:33400/calculateroute" :
               (process.env.PLATFORM == "openshift") ? "mongodb://calculateroute:tauste@" + process.env.OPENSHIFT_MONGODB_IP + ":27017/calculateroute" :
               (process.env.PLATFORM == "raspbian") ? "raspbian" :
               (process.env.PLATFORM == "windows") ? "mongodb://calculateroute:tauste@127.0.0.1:27017/calculateroute" :
               "mongodb://calculateroute:tauste@127.0.0.1:27017/calculateroute",
    assets: {
        client: {
            views: ['app/client/*/views/**/*.html'],
            css: [
                'app/client/*/css/*.css'
            ],
            js: [
                'app/client/config/config.js',
                'app/client/config/application.js',
                'app/client/*[!lib]*/*.js',
                'app/client/*[!lib]*/**/*.js'
            ],
            lib: {
                css: [
                    'app/client/lib/bootstrap/dist/css/bootstrap.css',
                    'app/client/lib/bootstrap/dist/css/bootstrap-theme.css'
                ],
                js: [
                    'app/client/lib/jquery/dist/jquery.js',
                    'app/client/lib/bootstrap/dist/js/bootstrap.js',
                    'app/client/lib/angular/angular.js',
                    'app/client/lib/angular-ui-router/release/angular-ui-router.js'
                ]
            },
            tests: [
            ]
        },
        server: {
            allJS: [
                'gruntfile.js',
                'server.js',
                'config/**/*.js',
                'app/*/server/**/*.js'
            ],
            routes: [
                'app/server/*[!core]/routes/**/*.js',
                'app/server/core/routes/**/*.js'
            ],
            config: 'app/server/*/config/*.js',
            views: 'modules/server/*/views/**/*.html'
        }
    }
};
