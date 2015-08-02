angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'satellizer'
])
.config(function ($urlRouterProvider, $locationProvider) {

    // Redirect to home view when route not found
    $urlRouterProvider.otherwise ('/');

    $locationProvider.html5Mode (true);
});
