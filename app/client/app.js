var app = angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'ngResource',
    'satellizer',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'contenteditable'
])
.config(function ($urlRouterProvider, $locationProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise ('/');

    $locationProvider.html5Mode (true);
})

.config(['$translateProvider', function ($translateProvider) {
        //$translateProvider.useMissingTranslationHandlerLog();

        $translateProvider.usePostCompiling (true);     // Importante para el instant
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
.factory('SatellizerInterceptor', ['$q', 'SatellizerConfig', 'SatellizerStorage', 'SatellizerShared', '$location', function($q, config, storage, shared, $location) {
    return {
        request: function(request) {
            if (request.skipAuthorization)
                return request;
            if (shared.isAuthenticated() && config.httpInterceptor) {
                var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
                var token = storage.get(tokenName);
                if (config.authHeader && config.authToken)
                    token = config.authToken + ' ' + token;
                request.headers[config.authHeader] = token;
            }
            return request;
        },
        responseError: function(response) {
            if (response.status == 409) {
                var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
                shared.removeToken();
                $location.url ('/login');
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
.directive('rangeParser', function() {
    return {
        require: '?ngModel',
        link: function (scope, element, attr, ctrl) {
            if (!ctrl) return;
            ctrl.$parsers.push(function (value) {
                var val = Number(value);
                if (val !== val) val = undefined;
                return val;
            });
        }
    }
})
.run (['$rootScope', 'tmhDynamicLocale', '$translate', '$auth', '$state', '$location', 'User', 'SatellizerShared',
function ($rootScope, tmhDynamicLocale, $translate, $auth, $state, $location, User, shared) {

    if (localStorage["calculateroute_token"])
        shared.setStorageType ("localStorage");
    else
        shared.setStorageType ("sessionStorage");

    if ($auth.isAuthenticated()) {
        User.me.get().$promise
        .then (function(response) {
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
        //if (window.innerWidth < 600)
        //    $('body').removeClass ('loaded');


        $(".modal").closeModal();           // Error que se queda oscuo cuando pretas ir "hacia atras" con un modal abierto
        if (toState.private   &&  !$auth.isAuthenticated()) {
            event.preventDefault();                             // HAY QUE CAMBIAR
            //$state.transitionTo ("login");
        }
        else if ($auth.isAuthenticated()  &&  (toState.name == "login"  ||  toState.name == "signup")) {
            console.log ("DENTRO LOGIN ENTRANDO");
            if (fromState.name)
                event.preventDefault();
            else
                $location.url ('/');
        }
        else if ($auth.isAuthenticated()  &&  toState.name == "home") {
            console.log ("DENTRO HOME ENTRANDO");
        }

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $(".side-nav li").removeClass("active");
        $(".side-nav a[ui-sref=" + toState.name + "]").parent().addClass("active");

        /*setTimeout(function(){
            $('body').addClass ('loaded');
        }, 500);
*/


    });
}]);
