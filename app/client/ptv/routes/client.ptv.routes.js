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
                //tollroads: $("#" + "trayect.tollroads".replace(/(:|\.|\[|\])/g, "\\$1")).val(),
                Ptv.setOptions ({
                    trayect: {
                        tollroads: $(tollroads).val(),
                        highways: $(highways).val()
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
                    width: $(width).val()
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
