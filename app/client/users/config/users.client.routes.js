
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('signup', {
                url: '/signup',
                templateUrl: 'users/views/authentication/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: 'users/views/authentication/signin.client.view.html'
            });
    }
]);
