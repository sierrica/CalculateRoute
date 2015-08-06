angular.module('calculateRoute')
    .config (['$stateProvider', '$authProvider',
    function ($stateProvider, $authProvider) {
        // Parametros de configuración
        $authProvider.httpInterceptor = true;               // Add Authorization header to HTTP request
        $authProvider.loginOnSignup = true;
        $authProvider.baseUrl = '/'                         // API Base URL for the paths below.
        $authProvider.loginRedirect = '/';
        $authProvider.logoutRedirect = '/signup';
        $authProvider.signupRedirect = '/';
        $authProvider.loginUrl = '/auth/signin';
        $authProvider.signupUrl = '/auth/signup';
        $authProvider.loginRoute = '/login';
        $authProvider.signupRoute = '/signup';
        $authProvider.tokenRoot = false;                    // set the token parent element if the token is not the JSON root
        $authProvider.tokenName = 'token';
        $authProvider.tokenPrefix = 'calculateroute';       // Local Storage name prefix
        $authProvider.unlinkUrl = '/auth/unlink/';
        $authProvider.unlinkMethod = 'get';
        $authProvider.authHeader = 'Authorization';
        $authProvider.authToken = 'Bearer';
        $authProvider.withCredentials = true;
        $authProvider.platform = 'browser';                 // or 'mobile'
        $authProvider.storage = 'localStorage';             // or 'sessionStorage'

        // Users state routing
        $stateProvider.
            state('signup', {
                url: '/signup',
                templateUrl: 'user/views/client.user.signup.view.html',
                private: false
            }).
            state('signin', {
                url: '/login',
                templateUrl: 'user/views/client.user.login.view.html',
                private: false
            }).
            state('logout', {
                url: '/logout',
                template: null,
                private: false
            });;
    }
]);
