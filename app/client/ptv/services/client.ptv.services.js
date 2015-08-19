app.service ('Ptv', function() {

    var options = {
        trayect: {
            tollroads: -15,
            highways: 2300
        }
    };



    return {
        getOptions: function (type) {
            if (type = 'trayect')
                return options.trayect;
        },
        setOptions: function(new_options) {
            options = angular.extend (options, new_options);
            //console.log (options);
        }
    }
});

