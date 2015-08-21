angular.module('calculateRoute').config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('home', {
        url: '/',
        templateUrl: 'core/views/client.home.view.html',
        private: true,
        onEnter: function () {
/*
            setTimeout(function(){
                $("#loader_route").next().css ("opacity", "0");
                $("#loader_route").css ("display", "inline");
            }, 400);
            setTimeout(function(){
                $("#loader_route").css ("display", "none");
                $("#loader_route").next().fadeTo (2000, 1, function() {});
            }, 1000);
*/
            console.log ("ENTRANDO EN HOME CONTROLLER");

        },
        onExit: function(Map) {
            //Map.getMap().remove();
            console.log ("SALIENDO EN HOME CONTROLLER");
            Map.saveMapHtml();
        }
    });
}]);
