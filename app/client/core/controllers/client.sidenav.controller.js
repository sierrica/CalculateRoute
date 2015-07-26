angular.module('calculateRoute').controller('SidenavController', ['$scope', '$state', '$auth',
    function($scope, $state, $auth) {

        $scope.close_sidenav = function (event) {
            if ($('.button-collapse').is(':visible'))
                $('.button-collapse').sideNav('hide');
        };

        angular.element(document).ready(function () {
            $('.button-collapse').sideNav({
                menuWidth: 300
            });
        });


        console.log ("DENTRO CONTROLADOR SIDENAV");
    }
]);
