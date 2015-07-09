angular.module('core').controller('HeaderController', ['$scope', '$state', '$auth',
	function($scope, $state, $auth) {
		console.log ("DENTRO CONTROLADOR MENU");


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
