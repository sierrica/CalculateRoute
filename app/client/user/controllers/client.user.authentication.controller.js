
angular.module('calculateRoute').controller('AuthenticationController', ['$scope', '$auth', '$location',
	function($scope, $auth, $location) {

		console.log ("DENTRO AUTHENTICATION CONTROLLER");



        $scope.signup = function() {
            $auth.signup ({
                email: $scope.email,
                password: $scope.password
            }).then (function() {
                console.log ("REGISTRADO CORRECTAMENTE");
            }).catch (function(response) {
                // Si ha habido errores, llegaremos a esta función
                if (typeof response.data.message === 'object') {
                    angular.forEach(response.data.message, function(message) {
                        console.log ("ERROR OBJETO");
                        console.log (message[0]);
                    });
                }
                else {
                    console.log ("ERROR NO OBJETO");
                    console.log (response.data.message);
                }
            });
        };


        $scope.signin = function() {
            console.log ("DENTRO");
            $auth.login ({
                email: $scope.email,
                password: $scope.password
            }).then (function() {
                console.log ("REGISTRADO CORRECTAMENTE");
            }).catch (function(response) {
                console.log ("ERROR NO OBJETO");
                console.log (response.data.message);
            });
        };
	}
]);