angular.module('calculateRoute').controller('HomeController', ['$scope', '$location', '$auth', 'Map',
    function($scope, $location, $auth, Map) {
        console.log ("DENTRO HOME CONTROLLER");


        if ( ! $auth.isAuthenticated())
            $location.path('/signup');


        angular.extend($scope, {
            london: {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            },
            defaults: {
                zoomControlPosition: 'topright',
                tileLayerOptions: {
                    opacity: 0.9,
                    detectRetina: true,
                    reuseTiles: true,
                },
                scrollWheelZoom: true,
                attributionControl: false
            }
        });



/*
        $scope.init_map = function () {
            var map = L.map('map').setView([51.505, -0.09], 13);
        };
*/
        window.onresize = function () {
            $(".angular-leaflet-map").css("width", $("#mapContainer").parent().width());
            $(".angular-leaflet-map").css("height", window.innerHeight - 50);
            map.updateSize();
        };


        $scope.map = function () {
            $(".angular-leaflet-map").css ("width", $("#mapContainer").parent().width());
            $(".angular-leaflet-map").css ("height", window.innerHeight - 50);
        };




        console.log ($auth.getToken());
        console.log ($auth.getPayload());



        $scope.mostrar_posicion = function (posicion) {
            console.log ("LATITUD");
            console.log (posicion.coords.latitude);
            $scope.latitud = posicion.coords.latitude;
            console.log ("LONGITUD");
            console.log (posicion.coords.longitude);
            $scope.$apply();
        };

        $scope.error_posicion = function (error) {
            console.log ("DENTRO OBETNER FRACASO");
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log ("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log ("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.log ("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log ("An unknown error occurred.");
                    break;
            };
        }

        var opciones_localizacion = { enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition ($scope.mostrar_posicion, $scope.error_posicion, opciones_localizacion);









    }
]);
