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
        expiration: process.env.TOKEN_EXPIRATION || 60*60*24            //24 hours
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
                'app/client/app.js',
                'app/client/*[!lib]*/*.js',
                'app/client/*[!lib]*/**/*.js'
            ],
            lib: {
                css: [
                    'app/client/lib/materialize/dist/css/materialize.css',
                    'http://fonts.googleapis.com/css?family=Roboto:500,300,700,100,400'
                ],
                js: [
                    'app/client/lib/jquery/dist/jquery.js',
                    'app/client/lib/angular/angular.js',
                    'app/client/lib/angular-resource/angular-resource.js',
                    'app/client/lib/angular-ui-router/release/angular-ui-router.js',
                    'app/client/lib/materialize/dist/js/materialize.js',
                    'app/client/lib/satellizer/satellizer.js',

                ]
            },
            tests: [
            ]
        },
        server: {
            models: 'server/*[!core]/models/**/*.js',
            routes: 'app/server/**/routes/**/*.js',
            config: 'app/server/*/config/*.js',
            views: 'modules/server/*/views/**/*.html'
        }
    }
};
