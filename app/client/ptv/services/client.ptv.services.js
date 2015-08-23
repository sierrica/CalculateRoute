app.factory ('Ptv', function(Map) {

    var options = {
        details: {
            manoeuvres: true
        },
        vehicle: {
          height: 145,
          width: 200
        },
        trayect: {
            dinamic_route: false,
            tollroads: -15,
            highways: 2300
        }
    };



    return {
        getOptions: function (type) {
            return options;
        },
        setOptions: function(new_options) {
            options = angular.extend (options, new_options);
        }
    }
});

