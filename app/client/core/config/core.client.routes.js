
// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Redirect to home view when route not found
				$urlRouterProvider.otherwise('/');

			console.log ("DENTRO")
		var authenticated = ['$q', 'Auth', function ($q, Auth) {
			var deferred = $q.defer();
			Auth.isLoggedIn(false)
				.then(function (isLoggedIn) {
					if (isLoggedIn) {
						deferred.resolve();
					} else {
						deferred.reject('Not logged in');
					}
				});
			return deferred.promise;
		}];


		// Home state routing
		$stateProvider.
			state ('home', {
				url: '/',
				templateUrl: 'core/views/home.client.view.html'
		});
	}
]);