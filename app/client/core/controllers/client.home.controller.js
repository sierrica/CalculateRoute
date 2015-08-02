angular.module('calculateRoute').controller('HomeController', ['$scope', '$location', '$auth', 'Map',
    function($scope, $location, $auth, Map) {
        console.log ("DENTRO HOME CONTROLLER");


        if ( ! $auth.isAuthenticated())
            $location.path('/signup');

        window.onresize = function () {
            $("#map").css ("width", $("#mapContainer").parent().width());
            $("#map").css ("height", window.innerHeight - 50);
        };
        $scope.map = function () {
            $("#map").css ("width", $("#mapContainer").parent().width());
            $("#map").css ("height", window.innerHeight - 50);

            // Tile Open Street Maps
            var open_maps = L.tileLayer ('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
                minZoom: 3
            });

            // Tile PTV Maps
            var ptv_maps_bg = L.tileLayer ('https://ajaxbg{s}-eu-n-test.cloud.ptvgroup.com/WMS/GetTile/xmap-ajaxbg/{x}/{y}/{z}.png', {
                subdomains: '1234',
                minZoom: 3
            });
            var ptv_maps_fg = new L.NonTiledLayer.WMS('https://ajaxfg-eu-n-test.cloud.ptvgroup.com/WMS/WMS?xtok=204109275126088', {
                minZoom: 3,
                opacity: 1.0,
                layers: 'xmap-ajaxfg',
                format: 'image/png',
                transparent: true,
                attribution: false,
                zIndex: 100
            });

            var ptv_maps = L.layerGroup([ptv_maps_bg, ptv_maps_fg]);


            // Crear el mapa con unos parametros por defecto
            var map = L.map ('map', {
                zoomControl: false,
                attributionControl: false,
                maxBounds: ([[31.952,-18.808],[72.607,44.472]]),
                layers: [open_maps],
                doubleClickZoom: false
            });

            map.setView ([41.505, -0.09], 13);

            // Añadir un boton con los tiles disponibles
            var baseLayers = {
                "OPEN": open_maps,
                "PTV": ptv_maps
            };
            L.control.layers(baseLayers).addTo (map);

        };
/*
        angular.extend($scope, {
            maxbounds: {
                northEast: {
                    lat: 31.952,
                    lng: -18.808
                },
                southWest: {
                    lat: 72.607,
                    lng: 44.472
                }
            },
            center: {
                lat: 41.505,
                lng: -0.09,
                zoom: 10
            },
            layers: {
                baselayers: {
                    ptvbg: {
                        name: "PTV background",
                        type: 'xyz',
                        url: "https://ajaxbg1-eu-n-test.cloud.ptvgroup.com/WMS/GetTile/xmap-ajaxbg/{x}/{y}/{z}.png"
                    }
                },
                overlays: {
                    ptvfg: {
                        name: "PTV foreground",
                        type: 'xyz',
                        url: "https://ajaxfg-eu-n-test.cloud.ptvgroup.com/WMS/WMS?xtok=204109275126088",
                        layerOptions: {
                            layers: 'xmap-ajaxfg',
                            opacity: 1.0,
                            format: 'image/png',
                            transparent: true,
                            zIndex: 100,
                        }
                    }
                }
            }
                       defaults: {
                tileLayer: 'https://ajaxbg1-eu-n-test.cloud.ptvgroup.com/WMS/GetTile/xmap-ajaxbg/{x}/{y}/{z}.png',



                //tileLayer: "http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}",
                tileLayerOptions: {
                    opacity: 0.9,
                    //detectRetina: true,
                    //reuseTiles: true
                },
                //noWrap: true,
                layers
                minZoom: 3,
                //maxZoom
                //crs
                //########### Interaction Options ###########
                                dragging: true,                             // herramienta de mano para moverte por el mapa
                touchZoom: true,                            // permitir hacer zoom con los 2 dedos (touch - pantallas tactiles)
                scrollWheelZoom: true,                      // permitir con la rutela del raton zoom + y zoom -
                doubleClickZoom: false,                     // docle click boton izq para hacer zoom +
                boxZoom: false,                             // hacer zoom al seleccionar mediante shift + mov del raton
                tap: true,                                  // retardo en los eventos de 200 ms (para disp tactiles)
                tapTolerance: 15,                           // The max number of pixels a user can shift his finger during touch for it to be considered a valid tap.
                trackResize: true,                          // Whether the map automatically handles browser window resize to update itself.
                worldCopyJump: false,                       // With this option enabled, the map tracks when you pan to another "copy" of the world and seamlessly jumps to the original one so that all overlays like markers and vector layers are still visible.
                closePopupOnClick: true,                    // cerrar los popups del mapa con un click.
                bounceAtZoomLimits: true,                   // Set it to false if you don't want the map to zoom beyond min/max zoom and then bounce back when pinch-zooming.
                //########### Keyboard Navigation Options ###########
                keyboard: true,                             // Moverte por el mapa con las flechas del teclado
                keyboardPanOffset: 80,                      // Num de px que se desplaza al pulsar una flecha (left, right)
                keyboardZoomOffset: 1,                      // Num de cambiones de nivel  de zoom al pulsar una flecha (uo, down)
                //########### Panning Inertia Options ###########
                inertia: true,                              // efecto de inercia en el movimiento, especial util para los moviles
                inertiaDeceleration: 3000,                  // ratio de inercia de movimiento, px/seg
                inertiaMaxSpeed: 1500,                      // Max velocidad del mov de inercia en px/seg
                inertiaThreshold: 'depends',                // ms que deben pasar entre parar el mov de un mov de inercia para que pare al instante
                //########### Control options ###########
                zoomControl: false,                         // layer con "+" y "-" para hacer zoom
                //zoomControl: { position: 'topleft', zoomInText: '+', zoomOutText: '-', zoomInTitle: 'Zoom in', zoomOutTitle: 'Zoom out' },
                attributionControl: false,                  // Leyenda o Copyright -> "Leaflet" de abajo a la derecha

                //########### Animation options ###########
                fadeAnimation: 'depends',                   // habilitar efecto CSS3 de ocultacion del mapa en todos los browser que lo soporten
                zoomAnimation: 'depends',                   // habilitar efecto CSS3 en los cambios de zoom en todos los browser que lo soporten
                zoomAnimationThreshold: 4,
                markerZoomAnimation: 'depends'

        }
    });*/







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
