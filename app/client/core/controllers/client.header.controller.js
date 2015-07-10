angular.module('core').controller('HeaderController', ['$rootScope','$scope', '$state', '$auth',
	function($rootScope, $scope, $state, $auth) {
		console.log ("DENTRO CONTROLADOR HEADER");

        $('.button-collapse').sideNav({
            menuWidth: 300,
            edge: 'left',
            closeOnClick: true
        });






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
