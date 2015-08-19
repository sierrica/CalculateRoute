app.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('trayect', {
        url: '/trayect',
        templateUrl: 'ptv/views/client.trayect.view.html',
        private: true,
        onEnter: function (Ptv) {
            trayect = Ptv.getOptions ('trayect');
        },
        onExit: function (Ptv) {
            console.log ("SALIENDO PTV");
            //tollroads: $("#" + "trayect.tollroads".replace(/(:|\.|\[|\])/g, "\\$1")).val(),
            Ptv.setOptions ({
                trayect: {
                    tollroads: $(tollroads).val(),
                    highways: $(highways).val()
                }
            });
        }
    });
}]);
