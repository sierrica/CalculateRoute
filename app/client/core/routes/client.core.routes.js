angular.module('calculateRoute')
.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('home', {
        url: '/',
        templateUrl: 'core/views/client.home.view.html',
        onExit: function() {
            $("#mapContainer").children().first().appendTo ("#mapContainerHide");
        }
    });
}]);
