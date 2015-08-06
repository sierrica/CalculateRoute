var app = angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'satellizer',
    'pascalprecht.translate',
    'tmh.dynamicLocale'
])
.config(function ($urlRouterProvider, $locationProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise ('/');

    $locationProvider.html5Mode (true);
})

.config(['$translateProvider', function ($translateProvider) {
        //$translateProvider.determinePreferredLanguage();
        //$translateProvider.uniformLanguageTag('bcp47').determinePreferredLanguage();

        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useSanitizeValueStrategy ('escaped');

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage (document.documentElement.lang);
}])
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern ('lib/angular-i18n/angular-locale_{{locale}}.js');
})
.factory('satellizer.interceptor', ['$q', 'satellizer.config', 'satellizer.storage', 'satellizer.shared', function($q, config, storage, shared) {
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
            return $q.reject(response);
        }
    };
}])
.run(function ($rootScope, tmhDynamicLocale, $auth, $state, $location) {

    tmhDynamicLocale.set (document.documentElement.lang.toLowerCase().replace(/_/g, '-'));

    $rootScope.$on ('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log (toState.private);
        console.log ($auth.isAuthenticated());
        if (toState.private   &&  !$auth.isAuthenticated()) {
            console.log ("CAMBIO ESTADO");
            event.preventDefault();
            $state.transitionTo ("signup");
            //$state.go('signup');
            //$location.path ('/signup');
        }
    });
});
