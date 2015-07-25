angular.module('calculateRoute').controller('SidenavController', ['$scope', '$state', '$auth',
    function($scope, $state, $auth) {

        $scope.close_sidenav = function (event) {
            if ($(".button-collapse").is(":visible"))
                $('.button-collapse').sideNav('hide');
        };




        console.log ("DENTRO CONTROLADOR SIDENAV");
    }
]);
