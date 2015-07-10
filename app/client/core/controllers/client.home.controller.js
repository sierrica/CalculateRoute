angular.module('core').controller('HomeController', ['$scope', '$location', '$auth',
    function($scope, $location, $auth) {
        console.log ("DENTRO HOME CONTROLLER");

        setTimeout(function() {
            $('body').addClass('loaded');
        }, 1700);




        console.log ($auth.getToken());
        console.log ($auth.getPayload());

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };


    }
]);
