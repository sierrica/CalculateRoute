angular.module('calculateRoute')
.config (['$stateProvider', function ($stateProvider, Map) {
    $stateProvider.
        state ('home', {
        url: '/',
        templateUrl: 'core/views/client.home.view.html',
        private: true,
        onEnter: function () {
            console.log ("ENTRANDO EN HOME CONTROLLER");
        },
        onExit: function() {
            //Map.getMap().remove();
            console.log ("SALIENDO EN HOME CONTROLLER");
            console.log (map);
            map.remove();

        }
    });
}]);
