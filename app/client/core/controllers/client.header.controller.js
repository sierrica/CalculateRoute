angular.module('calculateRoute').controller('HeaderController', ['$rootScope', '$scope', '$state', '$auth',
	function($rootScope, $scope, $state, $auth) {
		console.log ("DENTRO CONTROLADOR HEADER");


		$scope.close_sidenav = function (event) {
			if ($(".button-collapse").is(":visible"))
				$('.button-collapse').sideNav('hide');
		};




		$scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

		$scope.logut = function() {
            console.log ("DENTRO");
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
	}
]);
