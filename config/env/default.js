module.exports = {
    app: {
        title: 'calculateRoute',
        description: 'Calculador de Rutas',
        keywords: 'rutas, camiones'
    },
    environment: process.env.NODE_ENV || 'development',
    server: {
        ip: process.env.OPENSHIFT_NODEJS_IP ||"0.0.0.0",
        port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT  || 80
    },
    mongodb: {
        url: (process.env.PLATFORM == "heroku") ? "mongodb://sierrica:taustemix8888@ds033400.mongolab.com:33400/calculateroute" :
             (process.env.PLATFORM == "openshift") ? "mongodb://calculateroute:tauste@" + process.env.OPENSHIFT_MONGODB_IP + ":27017/calculateroute" :
             (process.env.PLATFORM == "raspbian") ? "raspbian" :
             (process.env.PLATFORM == "windows") ? "mongodb://calculateroute:tauste@127.0.0.1:27017/calculateroute" :
             "mongodb://calculateroute:tauste@127.0.0.1:27017/calculateroute"
    },
    redis: {
        ip: process.env.OPENSHIFT_REDIS_HOST || "pub-redis-18884.us-east-1-2.4.ec2.garantiadata.com",
        port: process.env.OPENSHIFT_REDIS_PORT || "18884"
    },
    token: {
        secret: process.env.TOKEN_SECRET || 'tauste',
        ttl: process.env.TOKEN_EXPIRATION || 60*60*24                   //24 hours
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
                'app/client/*/**/*.css'
            ],
            js: [
                'app/client/app.js',
                'app/client/*/**/*.js'
            ],
            lib: {
                css: [
                    'files/lib/materialize/dist/css/materialize.css',
                    'files/lib/perfect-scrollbar/css/perfect-scrollbar.css',
                    'files/lib/leaflet/dist/leaflet.css',
                    'files/lib/Leaflet.contextmenu/dist/leaflet.contextmenu.css',
                    'files/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css',
                    'files/lib/flag-icon-css/css/flag-icon.css',
                    'files/lib/select2/dist/css/select2.css'
                ],
                js: [
                    'files/lib/jquery/dist/jquery.js',
                    'files/lib/underscore/underscore.js',
                    'files/lib/angular/angular.js',
                    'files/lib/angular-touch/angular-touch.js',
                    'files/lib/angular-resource/angular-resource.js',
                    'files/lib/angular-ui-router/release/angular-ui-router.js',
                    'files/lib/angular-translate/angular-translate.js',
                    'files/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                    'files/lib/angular-translate-handler-log/angular-translate-handler-log.js',
                    'files/lib/angular-dynamic-locale/dist/tmhDynamicLocale.js',
                    'files/lib/select2/dist/js/select2.js',




                    'files/lib/materialize/dist/js/materialize.js',
                    'files/lib/satellizer/satellizer.js',
                    'files/lib/perfect-scrollbar/js/perfect-scrollbar.js',

                    'files/lib/leaflet/dist/leaflet.js',
                    'files/lib/Leaflet.contextmenu/dist/leaflet.contextmenu-src.js',
                    'files/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',

                    'files/ptv/ajax-maps/NonTiledLayer.js',
                    'files/ptv/ajax-maps/NonTiledLayer.WMS.js',
                    'files/ptv/ajax-maps/Leaflet.PtvLayer.js'
                ]
            },
            tests: [
            ]
        },
        server: {
            models: 'server/!(core)/models/**/*.js',
            routes: ['app/server/!(core)/routes/**/*.js', 'app/server/core/routes/**/*.js'],
            config: 'app/server/*/config/*.js',
            views: 'modules/server/*/views/**/*.html'
        }
    }
};
