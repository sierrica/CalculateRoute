app.factory('Map', function($http, $translate) {

    var token = 'c2b345bf-ae76-4f41-8467-6307423b1bf4';
    var cluster = 'eu-n-test';
    var xMapUrl = 'https://xmap-' + cluster + '.cloud.ptvgroup.com';




    L.PtvLayer.TruckAttributes = L.PtvLayer.TruckAttributes.extend ({
        _formatTooltip: function (description) {
            if ($translate.instant (description.split("#")[1]))
                return $translate.instant (description.split("#")[1]);
            else
                return description;
        }
    });
    L.PtvLayer.TrafficInformation = L.PtvLayer.TrafficInformation.extend ({
        _formatTooltip: function (description) {
            if ($translate.instant (description.split("#")[1]))
                return $translate.instant (description.split("#")[1]);
            else
                return description;
        }
    });






    // BASELAYERS
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
        "MAPNIK": open_maps_mapnik,
        "ROAD": open_maps_road,
        "PTV": ptv_maps
    };


    // OVERLAYS
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




    window.onresize = function () {
        $("#map").css ("width", $("#mapContainer").parent().width());
        $("#map").css ("height", window.innerHeight - 50);
    };




    var icon_loading = L.AwesomeMarkers.icon ({
        prefix: 'fa',
        icon: 'spinner',
        markerColor: 'red',
        spin:true
    });


    var showCoordinates2 = function (e) {
        //       console.log ("DENTRO SHOW COORDINATES 2");
        //       console.log (e);
    };

    var add_origin = function (e) {

        var marker_pre = L.marker (e.latlng, {icon: icon_loading}).addTo (map);
        console.log (e.latlng);

        $http.post ('/ptv/findlocation', e.latlng)
            .success(function(response, response_ptv) {
                console.log (response);
                map.removeLayer (marker_pre);
                var marker_1 = L.marker (e.latlng, {
                    draggable: true,
                    contextmenu: true,
                    contextmenuInheritItems: false,
                    contextmenuItems: [{
                        text: 'Marker item',
                        index: 0,
                        callback: showCoordinates2
                    }]
                }).addTo (map);

                var popup = '';
                popup += response.result.street;
                if (response.result.detaillevel > 6)
                    popup += ', ' + response.result.housenr;
                if (response.result.streetnumber != "")
                    popup += ' <b>(' + response.result.streetnumber + ')</b>';
                popup += '<br>';
                popup += response.result.postcode + ', ' + response.result.city;
                if (response.result.district != "")
                    popup += ' - <i>' + response.result.district + '<i/>';
                popup += '<br>';
                if ((response.result.province != ""))
                    popup += response.result.province + ', ';
                popup += response.result.state + ' - <b>(' + response.result.country + ')<b>';


                marker_1.bindPopup (popup).openPopup();

            })
            .error(function(response) {
                console.log ("FRACASO");
                console.log (response);
            });





    };

    var map;
    var pointer_marker;

    return {
        initMap: function(container) {
            $("#map").css ("width", $("#mapContainer").parent().width());
            $("#map").css ("height", window.innerHeight - 50);


            // Crear el mapa con unos parametros por defecto
            map = L.map ('map', {
                zoomControl: false,
                attributionControl: false,
                maxBounds: ([[31.952,-18.808],[72.607,44.472]]),
                layers: [ptv_maps],
                //layers: [open_maps_mapnik],
                doubleClickZoom: false,

                contextmenu: true,
                contextmenuWidth: 160,
                contextmenuItems: [{
                    text: 'anadir origen',
                    callback: add_origin
                }, {
                    text: 'anadir destino',
                    callback: add_origin
                }]
            });
            map.on ('contextmenu', function(e) {
                pointer_marker = L.marker (e.latlng).addTo (map);
            });
            map.on ('contextmenu.hide', function(contextmenu, relatedTarget) {
                map.removeLayer (pointer_marker);
            });
            map.on ('contextmenu:select', function(contextmenu, el) {
                //console.log ("contextmenu.select");
            });



            map.setView ([41.9204014, -1.2529047000000446], 18);
            /* Añadir un boton con los tiles disponibles */

            L.control.layers(baseLayers, overlays).addTo (map);





        }
    }

});
