angular.module('core').controller('HeaderController', ['$scope', '$state', '$auth', '$mdSidenav',
	function($scope, $state, $auth, $mdSidenav) {
		console.log ("DENTRO CONTROLADOR HEADER");


        $scope.sidenav = function() {
            console.log ("DENTRO")
            $mdSidenav('left').toggle();
        }


		$scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

		$scope.logut = function() {
            console.log ("DENTRO")
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
;
	}
]);
