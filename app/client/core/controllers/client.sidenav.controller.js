app.controller ('SidenavController', function($rootScope, $scope, $state, $auth, Sidenav, User) {

    console.log ("DENTRO CONTROLADOR SIDENAV");

    $scope.user = User.getUser();
    $rootScope.$on('logout', function (event) {
        $scope.user = User.getUser();
    });

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
});