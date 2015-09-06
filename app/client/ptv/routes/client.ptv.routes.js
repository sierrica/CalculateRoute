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

                        motorway: $(motorway).val(),
                        highway: $(highway).val(),
                        national: $(national).val(),
                        regional: $(regional).val(),
                        county: $(county).val(),
                        urban: $(urban).val(),
                        residential: $(residential).val(),

                        tollroad: $(tollroad).val(),
                        ramp: $(ramp).val(),
                        ferry: $(ferry).val()
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
                    vehicletype: $(vehicletype).val(),

                    height: $(height).val(),
                    width: $(width).val(),
                    lengt: $(lengt).val(),

                    emptyweight: $(emptyweight).val(),
                    totalweight: $(totalweight).val(),
                    trailerweight: $(trailerweight).val(),

                    loadtype: $(loadtype).val(),
                    hazardousgoodtype: $(hazardousgoodtype).val(),
                    loadweight: $(loadweight).val(),
                    maximumpassengers: $(maximumpassengers).val(),

                    axleload: $(axleload).val(),
                    axlenumber: $(axlenumber).val(),

                    cylinder: $(cylinder).val(),
                    fueltype: $(fueltype).val(),
                    fuelconsumption: $(fuelconsumption).val(),
                    emmissionclass: $(emmissionclass).val(),

                    yearmanufacturer: $(yearmanufacturer).val(),
                    delivery: $(delivery).val()
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
