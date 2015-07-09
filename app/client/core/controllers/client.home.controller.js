angular.module('core').controller('HomeController', ['$scope', '$location', '$auth',
    function($scope, $location, $auth) {
        console.log ("DENTRO HOME CONTROLLER");

        setTimeout(function() {
            $('body').addClass('loaded');
        }, 200);

        //Main Left Sidebar Menu
        $('.sidebar-collapse').sideNav({
            edge: 'left', // Choose the horizontal origin
        });


        console.log ($auth.getToken());
        console.log ($auth.getPayload());

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };


    }
]);
