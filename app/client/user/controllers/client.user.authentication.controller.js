app.controller ('AuthenticationController', ['$rootScope', '$scope', 'satellizer.shared', '$auth', '$location', 'tmhDynamicLocale', '$translate', 'User', function($rootScope, $scope, shared, $auth, $location, tmhDynamicLocale, $translate, User) {

	console.log ("DENTRO AUTHENTICATION CONTROLLER");


    $scope.lang_default = function() {
        var lang = document.documentElement.lang;
        $scope.lang = lang;
        $("#lang").select2 ("val", lang);
    };



    // Me aseguro que por defecto coja en sesion. Esto es peligroso pero como solo accedo cuando estoy desautenticado.
    $scope.remember = false;
    shared.almacenamiento = 'sessionStorage';

    $scope.signup = function() {
        if ($scope.remember)
            shared.almacenamiento = 'localStorage';
        console.log ($scope.lang)
        $auth.signup ({
            email: $scope.email,
            password: $scope.password,
            lang: $scope.lang
        }).then (function() {
            console.log ("REGISTRADO CORRECTAMENTE");
            User.me.get().$promise.then(function(response) {
                $rootScope.user = response.user;
                User.change_lang ($rootScope.user.lang);
            });
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
            User.me.get().$promise.then(function(response) {
                $rootScope.user = response.user;
                User.change_lang ($rootScope.user.lang);
            });
        }).catch (function(response) {
            console.log ("ERROR NO OBJETO");
            console.log (response.data.message);
        });
    };
}]);
