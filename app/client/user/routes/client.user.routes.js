app.config (['$stateProvider', '$authProvider', function ($stateProvider, $authProvider) {

    // Parametros de configuración
    $authProvider.httpInterceptor = true;               // Add Authorization header to HTTP request
    $authProvider.withCredentials = true;
    $authProvider.tokenRoot = null;                    // set the token parent element if the token is not the JSON root
    $authProvider.cordova = false,
    $authProvider.baseUrl = '/'                         // API Base URL for the paths below.
    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.unlinkUrl = '/logout';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'calculateroute';       // Local Storage name prefix
    $authProvider.authHeader = 'Authorization';
    $authProvider.authToken = 'Bearer';
    //$authProvider.loginOnSignup = true;
    //$authProvider.loginRedirect = '/';
    //$authProvider.logoutRedirect = '/login';
    //$authProvider.signupRedirect = '/';
    //$authProvider.loginRoute = '/login';
    //$authProvider.signupRoute = '/signup';


    //$authProvider.unlinkMethod = 'get';


    //$authProvider.platform = 'browser';                 // or 'mobile'

    //if (sessionStorage["calculateroute_token"])
    //    $authProvider.storage = 'sessionStorage';

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
    .state ('logout', {
        url: '/logout',
        template: null,
        private: false,
        controller: function($auth, $state) {
            if (! $auth.isAuthenticated()) {
                console.log ("FALLO");
                return;
            }
            $auth.logout()
            .then(function() {
                $state.transitionTo ("login");
                console.log ("DESAUTENTICADO");
            });
        }
    });
}]);
