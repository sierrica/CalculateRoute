app.config (['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state ('trayect', {
            url: '/trayect',
            templateUrl: 'ptv/views/client.trayect.view.html',
            private: true,
            onEnter: function (Ptv) {
                options = Ptv.getOptions ();
            },
            onExit: function (Ptv) {
                console.log ("SALIENDO TRAYECT");
                Ptv.setOptions ({
                    trayect: {
                        optimization: $(optimization).val(),
                        dinamic_route: $(dinamic_route).prop("checked"),
                        tollroads: $(tollroads).val(),
                        highways: $(highways).val(),
                        urban: $(urban).val(),
                        residential: $(residential).val(),
                        ramps: $(ramps).val(),
                        emission: $(emission).val()
                    }
                });
            }
        })
        .state ('vehicle', {
        url: '/vehicle',
        templateUrl: 'ptv/views/client.vehicle.view.html',
        private: true,
        onEnter: function (Ptv) {
            options = Ptv.getOptions ();
        },
        onExit: function (Ptv) {
            console.log ("SALIENDO VEHICLE");
            //tollroads: $("#" + "trayect.tollroads".replace(/(:|\.|\[|\])/g, "\\$1")).val(),
            Ptv.setOptions ({
                vehicle: {
                    height: $(height).val(),
                    width: $(width).val(),
                    weight: $(weight).val()
                }
            });
        }
    })
    .state ('details', {
        url: '/details',
        templateUrl: 'ptv/views/client.details.view.html',
        private: true,
        onEnter: function (Ptv) {
            options = Ptv.getOptions();
        },
        onExit: function (Ptv) {
            console.log("SALIENDO DETAILS");
            Ptv.setOptions ({
                details: {
                    manoeuvres: $(manoeuvres).prop("checked")
                }
            });
        }
    });
}]);
