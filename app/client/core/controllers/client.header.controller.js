angular.module('core').controller('HeaderController', ['$scope', '$state', '$auth',
	function($scope, $state, $auth) {
		console.log ("DENTRO CONTROLADOR MENU");


		$scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
;
	}
]);
