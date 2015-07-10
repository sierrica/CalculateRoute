
// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$authProvider',
	function($stateProvider, $urlRouterProvider, $authProvider) {

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise ('/');

		// Home state routing
		$stateProvider.
			state ('home', {
				url: '/',
                views: {
                    header: {
                        templateUrl: 'core/views/client.header.view.html',
                        controller: 'HeaderController'
                    },
                    content: {
                        templateUrl: 'core/views/client.home.view.html',
                        controller: 'HomeController'
                    }
                }
			});
	}
]);