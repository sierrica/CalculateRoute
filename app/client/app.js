var app = angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'ngResource',
    'satellizer',
    'pascalprecht.translate',
    'tmh.dynamicLocale'
])
.config(function ($urlRouterProvider, $locationProvider) {
    // /*Redirect to home view when route not found
    $urlRouterProvider.otherwise ('/');

    $locationProvider.html5Mode (true);
})

.config(['$translateProvider', function ($translateProvider) {
        //$translateProvider.useMissingTranslationHandlerLog();

        //$translateProvider.usePostCompiling (true);
        $translateProvider.useMissingTranslationHandler('myCustomHandlerFactory');
        $translateProvider.useSanitizeValueStrategy ('escaped');
        $translateProvider.useStaticFilesLoader ({
            prefix: 'i18n/',
            suffix: '.json'
        });
        //$translateProvider.preferredLanguage (document.documentElement.lang);
}])
.factory('myCustomHandlerFactory', function () {
    // has to return a function which gets a tranlation ID
    return function (translationID) {
        return translationID;
    };
})
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern ('lib/angular-i18n/angular-locale_{{locale}}.js');
})
.factory('satellizer.shared', ['$q', '$window', '$location', 'satellizer.config', 'satellizer.storage', function($q, $window, $location, config, storage) {
    var shared = {};

    if (localStorage["calculateroute_token"])
        shared.almacenamiento = "localStorage";
    else
        shared.almacenamiento = "sessionStorage";

    var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;

    shared.getToken = function() {
        if (shared.almacenamiento == 'sessionStorage')
            return sessionStorage.getItem (tokenName);
        else
            return localStorage.getItem (tokenName);
    };

    shared.getPayload = function() {
        //var token = storage.get(tokenName);
        var token;
        if (shared.almacenamiento == 'sessionStorage')
            token = sessionStorage.getItem (tokenName);
        else
            token = localStorage.getItem (tokenName);
        if (token && token.split('.').length === 3) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        }
    };

    shared.setToken = function(response, redirect) {
        var accessToken = response && response.access_token;
        var token;

        if (accessToken) {
            if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
                response = accessToken;
            } else if (angular.isString(accessToken)) {
                token = accessToken;
            }
        }

        if (!token && response) {
            token = config.tokenRoot && response.data[config.tokenRoot] ?
                response.data[config.tokenRoot][config.tokenName] : response.data[config.tokenName];
        }

        if (!token) {
            var tokenPath = config.tokenRoot ? config.tokenRoot + '.' + config.tokenName : config.tokenName;
            throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response.data));
        }

        //storage.set(tokenName, token);
        if (shared.almacenamiento == 'sessionStorage')
            sessionStorage.setItem (tokenName, token);
        else
            localStorage.setItem (tokenName, token);


        if (config.loginRedirect && !redirect) {
            $location.path(config.loginRedirect);
        } else if (redirect && angular.isString(redirect)) {
            $location.path(encodeURI(redirect));
        }
    };

    shared.removeToken = function() {
        //storage.remove(tokenName);
        if (shared.almacenamiento == 'sessionStorage')
            sessionStorage.removeItem (tokenName);
        else
            localStorage.removeItem (tokenName);
    };

    shared.isAuthenticated = function() {
        //var token = storage.get(tokenName);
        var token;
        if (shared.almacenamiento == 'sessionStorage')
            token = sessionStorage.getItem (tokenName);
        else
            token = localStorage.getItem (tokenName);

        if (token) {
            if (token.split('.').length === 3) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                var exp = JSON.parse($window.atob(base64)).exp;
                if (exp) {
                    return Math.round(new Date().getTime() / 1000) <= exp;
                }
                return true;
            }
            return true;
        }
        return false;
    };

    shared.logout = function(redirect) {
        //storage.remove(tokenName);
        if (shared.almacenamiento == 'sessionStorage')
            sessionStorage.removeItem (tokenName);
        else
            localStorage.removeItem (tokenName);

        if (config.logoutRedirect && !redirect) {
            $location.url(config.logoutRedirect);
        }
        else if (angular.isString(redirect)) {
            $location.url(redirect);
        }

        return $q.when();
    };

    shared.setStorage = function(type) {
        config.storage = type;
    };

    return shared;
}])
.factory ('satellizer.interceptor', ['$q', 'satellizer.config', 'satellizer.storage', 'satellizer.shared', '$location', function($q, config, storage, shared, $location) {
    return {
        request: function(request) {
            if (request.skipAuthorization)
                return request;
            if (shared.isAuthenticated() && config.httpInterceptor) {
                var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;

                var token;
                if (shared.almacenamiento == 'sessionStorage')
                    token = sessionStorage.getItem (tokenName);
                else
                    token = localStorage.getItem (tokenName);

                if (config.authHeader && config.authToken)
                    token = config.authToken + ' ' + token;
                request.headers[config.authHeader] = token;
            }
            return request;
        },
        responseError: function(response) {
            if (response.status == 409) {
                var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
                if (shared.almacenamiento == 'sessionStorage')
                    sessionStorage.removeItem (tokenName);
                else
                    localStorage.removeItem (tokenName);
                $location.url('/login');
            }
            return $q.reject(response);
        }
    };
}])
.factory('missingTranslationHandler', ['$log', '$translate',
    function missingTranslationHandlerFactory($log, $translate) {
        return function(translationId) {

            return true;
        };
    }
])
.run (function ($rootScope, tmhDynamicLocale, $translate, $auth, $state, $location, User) {

    if ($auth.isAuthenticated()) {
        User.me.get().$promise
            .then(function(response) {
                $rootScope.user = response.user;
                User.change_lang ($rootScope.user.lang);
            });
    }
    else {
        tmhDynamicLocale.set (document.documentElement.lang.toLowerCase());
        $translate.use (document.documentElement.lang);
        $state.transitionTo ("login");
    }

    $rootScope.$on ('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.private   &&  !$auth.isAuthenticated()) {
            event.preventDefault();                             // HAY QUE CAMBIAR
            //$state.transitionTo ("login");
        }
        else if ($auth.isAuthenticated()  &&  (toState.name == "login"  ||  toState.name == "signup")) {
            event.preventDefault();
            //$state.transitionTo (fromState.name);
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $(".side-nav li").removeClass("active");
        $(".side-nav a[ui-sref=" + toState.name + "]").parent().addClass("active");
    });
});
