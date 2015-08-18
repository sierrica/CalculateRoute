app.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('trayect', {
        url: '/trayect',
        templateUrl: 'ptv/views/client.trayect.view.html',
        private: true,
        onEnter: ['$rootScope', '$state', 'Ptv', function ($rootScope, $state, Ptv) {
            options = Ptv.getOptions();
        }],
        onExit: ['$state', '$rootScope', 'Ptv', function($state, $rootScope, Ptv) {
            console.log ("SALIENDO PTV")
            //console.log (tollroads);
            console.log ($(tollroads).val())


            Ptv.setOptions ({
                trayect: {
                    tollroads: $(tollroads).val(),
                    highways: $(highways).val()
                }
            });
            //Map.getMap().remove();
            console.log ("SALIENDO EN HOME CONTROLLER");

        }]
    });
}]);
