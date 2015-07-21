
// Setting up route
angular.module('core').config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$authProvider',
	function($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) {

		// Home state routing
		$stateProvider.
			state ('home', {
			url: '/',
			templateUrl: 'core/views/client.home.view.html'
		});

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise ('/');

		$locationProvider.html5Mode (true);

	}
]);