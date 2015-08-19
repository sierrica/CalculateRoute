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
            console.log ("SALIENDO PTV")
            Ptv.setOptions ({
                trayect: {
                    tollroads: $("#" + "trayect.tollroads".replace(/(:|\.|\[|\])/g, "\\$1")).val(),
                    highways: $("#" + "trayect.highways".replace(/(:|\.|\[|\])/g, "\\$1")).val()
                }
            });
        }
    });
}]);
