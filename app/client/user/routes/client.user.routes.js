app.config (['$stateProvider', '$authProvider', function ($stateProvider, $authProvider) {

    // Parametros de configuración
    $authProvider.httpInterceptor = true;               // Add Authorization header to HTTP request
    $authProvider.withCredentials = true;
    $authProvider.tokenRoot = null;                     // set the token parent element if the token is not the JSON root
    $authProvider.cordova = false,                      // necesario configurar para el uso de OAuth y cordova (REPASAR CUANDO SE IMPL OAUTH)
    $authProvider.baseUrl = '/'                         // API Base URL for the paths below.
    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.unlinkUrl = '/logout';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'calculateroute';       // Local Storage name prefix
    $authProvider.authHeader = 'Authorization';
    $authProvider.authToken = 'Bearer';

    // Users state routing
    $stateProvider
    .state ('signup', {
        url: '/signup',
        templateUrl: 'user/views/client.user.signup.view.html',
        private: false
    })
    .state ('login', {
        url: '/login',
        templateUrl: 'user/views/client.user.login.view.html',
        private: false
    })
    .state ('profile', {
        url: '/profile',
        templateUrl: 'user/views/client.user.profile.view.html',
        private: false
    })
    .state ('logout', {
        url: '/logout',
        template: null,
        private: false,
        controller: function($scope, $rootScope, $auth, $state, User) {
            if (! $auth.isAuthenticated()) {
                $state.transitionTo ("login");
                return;                                 // Lo mismo que else lo de abajo.
            }
            $auth.logout()
            .then (function() {
                User.removeUser();
                $rootScope.$emit ('logout');            // going up!
                $state.transitionTo ("login");
            });
        }
    });
}]);
