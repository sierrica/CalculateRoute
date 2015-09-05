var app = angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'ngResource',
    'satellizer',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'contenteditable',
    'ui.grid'
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
        //console.log ("DENTRO ERROR TRADUCCCION");
        //console.log (translationID);
        //console.log (this);
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
.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})
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
.filter('distanceParser', function () {
    return function (input) {
        return (input/1000).toFixed(0) + ' km, ' + input % 1000 + ' m';
    }
})
.filter('moneyParser', function () {
    return function (input) {
        return (input/100).toFixed(2);
    }
})
.filter('timeParser', function () {
    return function (input) {
        var h = Math.floor(input / (60 * 60));
        var m_divisor = input % (60 * 60);
        var m = Math.floor((input - (h * 3600)) / 60);
        var s_divisor = m_divisor % 60;
        var s = Math.ceil(s_divisor);
        return (h + ' h, ' + m + ' m, ' + s + ' s');
    }
})
.run (['$rootScope', 'tmhDynamicLocale', '$translate', '$auth', '$state', '$location', 'User', 'SatellizerShared', 'Map', 'Ptv',
function ($rootScope, tmhDynamicLocale, $translate, $auth, $state, $location, User, shared, Map, Ptv) {

    if (localStorage["calculateroute_token"])
        shared.setStorageType ("localStorage");
    else
        shared.setStorageType ("sessionStorage");

    if ($auth.isAuthenticated()) {
        User.me.get().$promise
        .then (function(response) {
            var user = response.user;
            user.name = user.email.split("@")[0];
            User.setUser (user);
            User.change_lang (response.user.lang);
            $rootScope.$broadcast ('login');
            Ptv.myoptions.get().$promise
                .then (function(response) {
                Ptv.setOptions (response.options);
                $rootScope.$emit ('myoptions');
            });
        });
    }
    else {
        tmhDynamicLocale.set (document.documentElement.lang.toLowerCase());
        $translate.use (document.documentElement.lang);
        $state.transitionTo ("login");
    }

    $rootScope.$on ('change_lang', function (event) {
        var breadcumb = $location.url().split("/")[1];
        if (breadcumb) {                             // No estamos en el home con el logo y por tanto hy ue traducir
            setTimeout (function() {
                $("#breadcumb").text ($translate.instant (breadcumb));
            }, 700);
        }
        /*var script = document.createElement('script');
        script.id = 'script_google_maps';
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
            '&language=' + document.documentElement.lang.split("-")[1].toLowerCase() +
            '&callback=initialize';
        //$("#script_google_maps").remove();
        setTimeout(function(){
            document.body.appendChild (script);
        }, 100);*/
    });


    $rootScope.$on ('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //if (window.innerWidth < 600)
        //    $('body').removeClass ('loaded');

        $(".modal").closeModal();           // Error que se queda oscuo cuando pretas ir "hacia atras" con un modal abierto
        $(".lean-overlay").remove();        // Error que se queda oscuo cuando pretas ir "hacia atras" con un modal abierto

        if (toState.private   &&  !$auth.isAuthenticated()) {
            event.preventDefault();                             // HAY QUE CAMBIAR
            //$state.transitionTo ("login");
        }
        else if ($auth.isAuthenticated()  &&  (toState.name == "login"  ||  toState.name == "signup")) {
            if (fromState.name)
                event.preventDefault();
            else
                $location.url ('/');
        }
    });




    $rootScope.$on ('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $(".side-nav li").removeClass("active");
        $(".side-nav a[ui-sref=" + toState.name + "]").parent().addClass("active");


        if (toState.name == "home") {
            $("#breadcumb").html ('<img src="images/logo_camion.png" style="height:60px; width:135px"/>');
            setTimeout(function(){
                $("#search").parent().css ('display', 'block');
                $("#search").parent().css ('opacity', '1');
            }, 500);
        }
        else {
            setTimeout (function() {
                $("#breadcumb").text ($translate.instant (toState.name));
            }, 200);
            $("#search").parent().css ("display", "none");
        }
        /*setTimeout(function(){
            $('body').addClass ('loaded');
        }, 500);
*/
    });
}]);
