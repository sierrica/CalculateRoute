app.controller ('HomeController', function ($rootScope, $scope, $location, $auth, Map, $http, User, $translate) {
    console.log ("DENTRO HOME CONTROLLER");

    var token = 'c2b345bf-ae76-4f41-8467-6307423b1bf4';
    var cluster = 'eu-n-test';
    var xMapUrl = 'https://xmap-' + cluster + '.cloud.ptvgroup.com';


    // BASELAYERS

    // Google Maps
    var google_maps = new L.Google ('ROADMAP', {
        minZoom: 3
    });

    // Tile Open Street Maps
    var open_maps_mapnik = L.tileLayer ('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3
    });
    var open_maps_road = L.tileLayer ('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
        minZoom: 3
    });
    // Tile PTV Maps
    var ptv_maps_bg = L.tileLayer ('https://ajaxbg{s}-eu-n-test.cloud.ptvgroup.com/WMS/GetTile/xmap-ajaxbg/{x}/{y}/{z}.png', {
        subdomains: '1234',
        minZoom: 3
    });
    var ptv_maps_fg = new L.NonTiledLayer.WMS('https://ajaxfg-eu-n-test.cloud.ptvgroup.com/WMS/WMS?xtok=' + token, {
        minZoom: 3,
        opacity: 1.0,
        layers: 'xmap-ajaxfg',
        format: 'image/png',
        transparent: true,
        attribution: false,
        zIndex: 100
    });
    var ptv_maps = L.layerGroup ([ptv_maps_bg, ptv_maps_fg]);
    var baseLayers = {
        "GOOGLE": google_maps,
        "MAPNIK": open_maps_mapnik,
        "ROAD": open_maps_road,
        "PTV": ptv_maps
    };


    /* OVERLAYS */
    var ptv_maps_traffic = new L.PtvLayer.TrafficInformation (xMapUrl, {
        zIndex: 1,
        token: token
    });
    var ptv_maps_truck = new L.PtvLayer.TruckAttributes (xMapUrl, {
        zIndex: 998,
        token: token
    });
    var ptv_maps_poi = new L.PtvLayer.POI (xMapUrl, {
        zIndex: 3,
        token: token
    });
    var overlays = {
        "TRUCK": ptv_maps_truck,
        "POI": ptv_maps_poi,
        "TRAFFIC": ptv_maps_traffic
    };






    $scope.addOrigin = function (ev) {
        $scope.add (ev, 0);
    };

    $scope.addDestine = function (ev) {
        $scope.add (ev, Map.MarkersStations.length);
    };

    $scope.addIntermediate = function (ev) {
        $('#modal_choice_index').openModal();
        var that = $scope;
        $("#button_select_choice_index").off('click').on ('click', function(e) {
            that.add (ev, that.select_choice_index.index);
            $('#modal_choice_index').closeModal();
        });


        //$scope.add (ev, 1);
    };

    $scope.add = function (ev, index) {
        var point_selected = ev;
        var loading_marker = L.marker (point_selected.latlng, {icon: Map.IconLoading }).addTo ($scope.map);
        var that = $scope;
        $http.post ('/ptv/findlocation', point_selected.latlng)
            .success (function(response, response_ptv) {
            that.map.removeLayer (loading_marker);
            var marker = L.marker (point_selected.latlng, {
                icon: new L.NumberedDivIcon ({ letter: Map.Letters[index] }),
                draggable: true,
                contextmenu: true,
                contextmenuInheritItems: false,
                contextmenuItems: [{
                    index: 3,
                    icon: 'images/cross_red.png',
                    text: $translate.instant('borrar'),
                    callback: function (ev) {
                        that.map.removeLayer (Map.MarkersStations[that.index_marker_selected]);
                        Map.MarkersStations.splice (that.index_marker_selected, 1);         // REMOVE
                        for (i=that.index_marker_selected; i<Map.MarkersStations.length; i++)
                            Map.MarkersStations[i].setIcon (new L.NumberedDivIcon ({ letter: Map.Letters[i] }));
                    }
                }]
            })
            .on ("contextmenu", function(ev) {
                var marker_selected = ev.target;
                that.index_marker_selected = _.indexOf (Map.MarkersStations, marker_selected);
            })
            .on ("dragstart", function(ev) {
                var marker_selected = ev.target;
                that.map.contextmenu.hide();
                that.latlng_dragstart = marker_selected.getLatLng();

            })
            .on ("dragend", function(ev) {
                //console.log (marker_selected.getLatLng());
                var marker_selected = ev.target;
                marker_selected.setOpacity (0.0);
                var marker_loading = L.marker (ev.target.getLatLng(), {icon: Map.IconLoading }).addTo (that.map);
                $http.post ('/ptv/findlocation', marker_selected.getLatLng())
                .success (function(response) {
                    that.map.removeLayer (marker_loading);
                    marker_selected.openPopup().getPopup().setContent (Map.formatDirPopup (response.result));
                    marker_selected.setOpacity (1);
                })
                .error (function(response, status) {
                    if (status == 404) {
                        //console.log ("PUNTO IMPOSIBLE DE LOCALIZAR");
                        that.map.removeLayer (marker_loading);
                        marker_selected.setLatLng (that.latlng_dragstart);
                        marker_selected.update();
                        marker_selected.setOpacity (1);
                        Materialize.toast ('<span class="red">' + 'PUNTO IMPOSIBLE DE LOCALIZAR' + '</span>', 4000);
                    }
                });
            })
            .bindPopup (Map.formatDirPopup(response.result))
            .addTo (that.map)
            .openPopup();

            Map.MarkersStations.splice (index, 0, marker);                 //ADD
            for (i=index; i<Map.MarkersStations.length; i++)
                Map.MarkersStations[i].setIcon (new L.NumberedDivIcon ({letter: Map.Letters[i] }));
            console.log ("MARKERS");
            console.log (Map.MarkersStations);
        })
        .error (function(response, status) {
            if (status == 404) {
                that.map.removeLayer (marker_pre);
                console.log ("PUNTO IMPOSIBLE DE LOCALIZAR");
                Materialize.toast ('<span class="red">' + 'PUNTO IMPOSIBLE DE LOCALIZAR' + '</span>', 4000);
            }
        });
    }



    $scope.initMap = function () {
        $("#map").css ("width", $("#mapContainer").parent().width());
        $("#map").css ("height", window.innerHeight - 50);
        var that = $scope;
        $scope.map = L.map ('map', {
            zoomControl: false,
            attributionControl: false,
            maxBounds: ([[31.952,-18.808],[72.607,44.472]]),
            layers: google_maps,
            //layers: [open_maps_mapnik],
            contextmenu: true,
            contextmenuWidth: 160,
            contextmenuItems: [{
                index: 0,
                icon: 'images/flecha_verde.png',
                text: $translate.instant('origen'),
                callback: that.addOrigin
            }, {
                index: 1,
                icon: 'images/flecha_verde.png',
                text: $translate.instant('intermedio'),
                callback: that.addIntermediate
            }, {
                index: 2,
                icon: 'images/flecha_verde.png',
                text: $translate.instant('destino'),
                callback: that.addDestine
            }]
        })
        .on ('contextmenu', function(ev) {
            if (that.pointer_marker)
                that.map.removeLayer (that.pointer_marker);
            that.pointer_marker = L.marker (ev.latlng, { icon: Map.IconPushpin }).addTo (that.map);
        })
        .on ('contextmenu.hide', function(contextmenu, relatedTarget) {
            that.map.removeLayer (that.pointer_marker);
        })
        .on ('contextmenu:select', function(contextmenu, el) {
            //var index_select = $("div.leaflet-contextmenu a").index(contextmenu.el);
        })
        .on ('load', function(e) {

            if (e.name = "GOOGLE") {
                setTimeout(function () {
                    $("div.gmnoprint, div.gm-style-cc").fadeOut(1000, function () {
                        $("div.gmnoprint, div.gm-style-cc").remove();
                    });
                    $("img[src='http://maps.gstatic.com/mapfiles/api-3/images/google_white2.png']").first().parent().parent().parent().fadeOut(1000, function () {
                        $("img[src='http://maps.gstatic.com/mapfiles/api-3/images/google_white2.png']").first().parent().parent().parent().remove();
                    });
                }, 2000);
            }
        })
        .on ('baselayerchange', function(e) {
            if (e.name = "GOOGLE") {
                setTimeout(function(){
                    $("div.gmnoprint, div.gm-style-cc").fadeOut (1000, function() {
                        $("div.gmnoprint, div.gm-style-cc").remove();
                    });
                    $("img[src='http://maps.gstatic.com/mapfiles/api-3/images/google_white2.png']").first().parent().parent().parent().fadeOut (1000, function() {
                        $("img[src='http://maps.gstatic.com/mapfiles/api-3/images/google_white2.png']").first().parent().parent().parent().remove();
                    });
                }, 2000);
            }
            console.log(e);
        })
        .setView ([41.9204014, -1.2529047000000446], 18);

        L.control.layers (baseLayers, overlays).addTo (that.map);

        // marker hidden necessary for fix bug in layer google maps in Android, when Zoom -> Crash
        var marker_bug_google = L.marker ([0, 0], { opacity: 0.0 }).addTo (that.map);
        //Map.setMap ($scope.map);

    };


    $scope.select_choice_index = { index: 0 };
    $scope.options_choice_index = function() {
        var available_options = [];
        if (Map.MarkersStations.length == 0)
            available_options.push ({ index: 0, text: "A: Origen" })
        else {
            for (i=0; i<Map.MarkersStations.length; i++) {
                available_options.push ({
                    index: i,
                    text: Map.Letters[i] + ': ' + Map.MarkersStations[i].getPopup().getContent().replace(/[<]br[^>]*[>]/gi," - ").replace(/[<]b[^>]*[>]/gi,"")
                });
            }
        }
        return available_options;
    };








    console.log ("PAYLOAD");
    console.log ($auth.getPayload());






    $scope.calculateroute = function () {
        $http.post ('/ptv/calculateroute', $scope.credentials)
             .success(function(response) {
                //console.log (response);
            })
            .error(function(response) {
            console.log ("FRACASO");
            console.log (response);
        });
    }

    $scope.mostrar_posicion = function (posicion) {
        //console.log ("LATITUD");
        //console.log (posicion.coords.latitude);
        $scope.latitud = posicion.coords.latitude;
        //console.log ("LONGITUD");
        //console.log (posicion.coords.longitude);
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
    navigator.geolocation.getCurrentPosition ($scope.mostrar_posicion, $scope.error_posicion, { enableHighAccuracy: true });
});
