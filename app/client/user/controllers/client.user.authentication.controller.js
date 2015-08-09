app.controller ('AuthenticationController', ['$scope', 'satellizer.shared', '$auth', '$location', function($scope, shared, $auth, $location) {

	console.log ("DENTRO AUTHENTICATION CONTROLLER");



    $scope.lang_choice = function() {
        var lang = document.documentElement.lang.toLowerCase().replace(/_/g, '-').split('-')[1];
        $scope.lang = lang;
        $("#lang").select2 ("val", lang);
    };

    // Me aseguro que por defecto coja en sesion. Esto es peligroso pero como solo accedo cuando estoy desautenticado.
    shared.almacenamiento = 'sessionStorage';
    $scope.signup = function() {
        console.log ($scope.remember);
        //$auth.setStorage('sessionStorage');
        if ($scope.remember)
            shared.almacenamiento = 'localStorage';
        $auth.signup ({
            email: $scope.email,
            password: $scope.password
        }).then (function() {
            console.log ("REGISTRADO CORRECTAMENTE");
            console.log ($auth.getToken());
            console.log ($auth.getPayload());
        }).catch (function(response) {
            console.log ("ERROR EN EL REGISTRO");
            // Si ha habido errores, llegaremos a esta función
            if (typeof response.data.message === 'object') {
                angular.forEach(response.data.message, function(message) {
                    console.log ("ERROR OBJETO");
                    console.log (message[0]);
                });
            }
            else {
                console.log ("ERROR NO OBJETO");
                console.log (response.data.message);
            }
        });
    };

    $scope.login = function() {
        if ($scope.remember)
            shared.almacenamiento = 'localStorage';
        $auth.login ({
            email: $scope.email,
            password: $scope.password
        }).then (function() {
            console.log ("LOGUEADO CORRECTAMENTE");
            console.log ($auth.getToken());
            console.log ($auth.getPayload());
        }).catch (function(response) {
            console.log ("ERROR NO OBJETO");
            console.log (response.data.message);
        });
    };
}]);
