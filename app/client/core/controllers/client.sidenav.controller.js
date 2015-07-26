angular.module('calculateRoute').controller('SidenavController', ['$rootScope', '$scope', '$state', '$auth',
    function($rootScope, $scope, $state, $auth) {

        $scope.close_sidenav = function (event) {
            if ($('.button-collapse').is(':visible'))
                $('.button-collapse').sideNav('hide');
        };

        $rootScope.$on('$includeContentLoaded', function() {
            $('.button-collapse').sideNav({
                menuWidth: 300
            });
        });


        console.log ("DENTRO CONTROLADOR SIDENAV");
    }
]);
