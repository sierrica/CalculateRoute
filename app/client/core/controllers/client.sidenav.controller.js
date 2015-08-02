angular.module('calculateRoute').controller('SidenavController', ['$rootScope', '$scope', '$state', '$auth', 'Sidenav',
    function($rootScope, $scope, $state, $auth, Sidenav) {

        console.log ("DENTRO CONTROLADOR SIDENAV");


        $rootScope.$on('$includeContentLoaded', function() {
            Sidenav.init();
        });

        $scope.close_sidenav = function ($event) {
            Sidenav.close_sidenav ($event)
        };

        $scope.dropdown = function ($event) {
            Sidenav.dropdown($event);
        };

        $scope.logut = function() {
            console.log ("DENTRO");
            $scope.logut = function() {
                if (!$auth.isAuthenticated()) {
                    console.log ("FALLO");
                    return;
                }
                $auth.logout()
                    .then(function() {
                        console.log ("DESAUTENTICADO");
                    });
            };
        };


    }
]);
