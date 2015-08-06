angular.module('calculateRoute')
.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('home', {
        url: '/',
        templateUrl: 'core/views/client.home.view.html',
        private: true,
        onEnter: function () {
        },
        onExit: function() {
        }
    });
}]);
