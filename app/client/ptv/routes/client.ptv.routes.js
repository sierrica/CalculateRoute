app.config (['$stateProvider', function ($stateProvider, Ptv) {
    $stateProvider.
        state ('trayect', {
        url: '/trayect',
        templateUrl: 'ptv/views/client.trayect.view.html',
        private: true,
        resolve: {

            // A string value resolves to a service
            Ptv: 'Ptv'

            // A function value resolves to the return
            // value of the function
            /*options: function (Ptv) {
                return Ptv.getOptions();
            }*/
        },
        onEnter: function () {

            //opciones = Ptv.getDefaults();
        },
        onExit: function() {
/*
            Ptv.setOptions ({
                trayect: {
                    tollroads: tollroads,
                    highways: highways
                }
            });
            */
            //Map.getMap().remove();
            console.log ("SALIENDO EN HOME CONTROLLER");

        }
    });
}]);
