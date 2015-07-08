
angular.module('user').config(['$authProvider', '$stateProvider',
    function ($authProvider, $stateProvider) {

        // Parametros de configuración

        $authProvider.loginUrl = "/auth/signin";
        $authProvider.loginRedirect = '/';
        $authProvider.signupUrl = "/auth/signup";
        $authProvider.signupRedirect = '/';
        $authProvider.logoutRedirect = '/';

        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "calculateroute",

        // Users state routing
        $stateProvider.
            state('auth', {
                abstract: true,
                url: '/auth',
                template: '<ui-view/>'
            }).
            state('auth.signup', {
                url: '/signup',
                templateUrl: 'user/views/authentication/client.user.signup.view.html'
            }).
            state('auth.signin', {
                url: '/signin',
                templateUrl: 'user/views/authentication/client.user.signin.view.html'
            }).
            state('auth.logout', {
                url: '/logout',
                template: null,
                controller: 'AuthenticationController'
            });;
    }
]);
