angular.module('calculateRoute').controller('SidenavController', ['$scope', '$state', '$auth',
    function($scope, $state, $auth) {

        $scope.close_sidenav = function (event) {
            if ($(".button-collapse").is(":visible"))
                $('.button-collapse').sideNav('hide');
        };


        $('.button-collapse').sideNav({
            menuWidth: 300,
            edge: 'left',
            closeOnClick: false
        });

        console.log ("DENTRO CONTROLADOR SIDENAV");
    }
]);
