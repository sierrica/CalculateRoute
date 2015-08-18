app.factory ('Ptv', function() {

    var options = {
        trayect: {
            tollroads: 30,
            highways: 0
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

