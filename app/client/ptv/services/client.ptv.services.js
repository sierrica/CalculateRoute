app.service ('Ptv', function() {

    var options = {
        trayect: {
            tollroads: -15,
            highways: 2300
        }
    };

    return {
        getOptions: function () {
            return options;
        },
        setOptions: function(new_options) {
            options = angular.extend (options, new_options);
            console.log (options);
        }
    }
});

