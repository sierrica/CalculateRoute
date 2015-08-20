angular.module('calculateRoute')
.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('home', {
        url: '/',
        templateUrl: 'core/views/client.home.view.html',
        private: true,
        onEnter: function () {
            console.log ("ENTRANDO EN HOME CONTROLLER");
        },
        onExit: function(Map) {
            //Map.getMap().remove();
            console.log ("SALIENDO EN HOME CONTROLLER");
            //Map.getMap().remove();
        }
    });
}]);
