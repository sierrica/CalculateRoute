app.controller ('SidenavController', ['$rootScope', '$scope', '$state', '$auth', 'Sidenav', function($rootScope, $scope, $state, $auth, Sidenav) {
    console.log ("DENTRO CONTROLADOR SIDENAV");

    $rootScope.$on('$includeContentLoaded', function() {
        Sidenav.init();
    });

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.close_sidenav = function ($event) {
        Sidenav.close_sidenav ($event)
    };

    $scope.dropdown = function ($event) {
        Sidenav.dropdown($event);
    };
}]);
