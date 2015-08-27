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

    var results = {
        polygon: [],
        info: { cost: 0, distance: 0, time: 0 },
        manoeuvres: []
    };

    return {
        getOptions: function (type) {
            return options;
        },
        setOptions: function(new_options) {
            options = angular.extend (options, new_options);
        },
        getResults: function() {
            return results;
        },
        setResults: function(new_results) {
            results = angular.extend (results, new_results);
        }
    }
});