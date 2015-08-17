app.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.
        state ('trayect', {
        url: '/trayect',
        templateUrl: 'ptv/views/client.trayect.view.html',
        private: true
    });
}]);
