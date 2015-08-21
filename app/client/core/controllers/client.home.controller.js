app.controller ('HomeController', function ($rootScope, $scope, $location, $auth, Map, $http, User, $translate) {
    console.log ("DENTRO HOME CONTROLLER");



    $scope.addOrigin = function (ev) {
        $scope.add (ev, 0);
    };

    $scope.addDestine = function (ev) {
        $scope.add (ev, Map.lengthMarkerStations());
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

    $scope.contextMenu = function (marker) {
        var that = $scope;
        marker.on ("contextmenu", function(ev) {
            var marker_selected = ev.target;
            that.index_marker_selected = _.indexOf (Map.getMarkersStations(), marker_selected);
        });
    };
    $scope.dragStart = function (marker) {
        var that = $scope;
        marker.on ("dragstart", function(ev) {
            var marker_selected = ev.target;
            that.map.contextmenu.hide();
            that.latlng_dragstart = marker_selected.getLatLng();

        })
    };
    $scope.dragEnd = function (marker) {
        var that = $scope;
        marker.on ("dragend", function(ev) {
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
        });
    };

    var removeMarker = function(ev) {
        var that = $scope;
        that.map.removeLayer (Map.getMarkerStation(that.index_marker_selected));
        Map.removeMarkerStation (that.index_marker_selected);                 // REMOVE
        for (i=that.index_marker_selected; i<Map.lengthMarkerStations(); i++) {
            var marker = Map.getMarkerStation(i);
            marker.setIcon (new L.NumberedDivIcon ({ letter: Map.Letters[i] }));
            Map.setMarkerStation (marker, i);
        }
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
                    text: $translate.instant ('borrar'),
                    callback: removeMarker
                }]
            });
            that.contextMenu (marker);
            that.dragStart (marker);
            that.dragEnd (marker);
            marker.bindPopup (Map.formatDirPopup(response.result));
            Map.addMarkerStation (marker, index);                  //ADD TO FACTORY
            //marker.addTo (that.map);
            marker.openPopup();


            for (i=index; i<Map.lengthMarkerStations(); i++) {
                var marker = Map.getMarkerStation(i);
                marker.setIcon (new L.NumberedDivIcon ({letter: Map.Letters[i] }));
                Map.setMarkerStation (marker, i);
            }
        })
        .error (function(response, status) {
            if (status == 404) {
                that.map.removeLayer (marker_pre);
                console.log ("PUNTO IMPOSIBLE DE LOCALIZAR");
                Materialize.toast ('<span class="red">' + 'PUNTO IMPOSIBLE DE LOCALIZAR' + '</span>', 4000);
            }
        });
    }


    $scope.renderMap = function() {
        $("#map").css("width", $("#mapContainer").parent().width());
        $("#map").css("height", window.innerHeight - 50);
        if (Map.getMap() != undefined)
            $("#map").html (Map.restoreMapHtml());
        else
            $scope.initMap();
    };


    $scope.initMap = function () {
        var that = $scope;
        $scope.map = L.map('map', {
            zoomControl: false,
            attributionControl: false,
            maxBounds: ([[31.952, -18.808], [72.607, 44.472]]),
            layers: Map.getLayer('google_maps'),
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
        }).on ('contextmenu', function (ev) {
            if (that.pointer_marker)
                that.map.removeLayer(that.pointer_marker);
            that.pointer_marker = L.marker(ev.latlng, {icon: Map.IconPushpin}).addTo(that.map);
        }).on ('contextmenu.hide', function (contextmenu, relatedTarget) {
            that.map.removeLayer(that.pointer_marker);
        }).on('contextmenu:select', function (contextmenu, el) {
            //var index_select = $("div.leaflet-contextmenu a").index(contextmenu.el);
        }).on('load', function (e) {
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
        }).on('baselayerchange', function (e) {
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
            console.log(e);
        }).setView([41.9204014, -1.2529047000000446], 18);

        L.control.layers (Map.getBaseLayers(), Map.getOverlays()).addTo (that.map);

        // marker hidden necessary for fix bug in layer google maps in Android, when Zoom -> Crash
        var marker_bug_google = L.marker([0, 0], {opacity: 0.0}).addTo(that.map);
        Map.setMap ($scope.map);

    };



    $scope.select_choice_index = { index: 0 };
    $scope.options_choice_index = function() {
        var available_options = [];
        if (Map.lengthMarkerStations() == 0)
            available_options.push ({ index: 0, text: "A: Origen" })
        else {
            for (i=0; i<Map.lengthMarkerStations(); i++) {
                available_options.push ({
                    index: i,
                    text: Map.Letters[i] + ': ' + Map.getMarkerStation(i).getPopup().getContent().replace(/[<]br[^>]*[>]/gi," - ").replace(/[<]b[^>]*[>]/gi,"")
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
