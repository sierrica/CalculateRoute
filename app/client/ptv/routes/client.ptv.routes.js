app.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('trayect', {
        url: '/trayect',
        templateUrl: 'ptv/views/client.trayect.view.html',
        private: true,
        onEnter: function (Ptv) {
            options = Ptv.getOptions();
        },
        onExit: function (Ptv) {
            console.log ("SALIENDO PTV")
            //console.log (tollroads);
            console.log ($(tollroads).val())
            Ptv.setOptions ({
                trayect: {
                    tollroads: $(tollroads).val(),
                    highways: $(highways).val()
                }
            });
        }
    });
}]);
