app.factory('Map', function() {


    var token = 'c2b345bf-ae76-4f41-8467-6307423b1bf4';
    var cluster = 'eu-n-test';
    var xMapUrl = 'https://xmap-' + cluster + '.cloud.ptvgroup.com';


    function getUrlPram(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }


    window.onresize = function () {
        $("#map").css ("width", $("#mapContainer").parent().width());
        $("#map").css ("height", window.innerHeight - 50);
    };



    var map;

    return {
        initMap: function(container) {
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






            var ptv_maps = L.layerGroup([ptv_maps_bg, ptv_maps_fg]);

            var baseLayers = {
                "MAPNIK": open_maps_mapnik,
                "ROAD": open_maps_road,
                "PTV": ptv_maps
            };

            var overlays = {
                "TRUCK": ptv_maps_truck,
                "POI": ptv_maps_poi,
                "TRAFFIC": ptv_maps_traffic
            }








            $("#map").css ("width", $("#mapContainer").parent().width());
            $("#map").css ("height", window.innerHeight - 50);


            // Crear el mapa con unos parametros por defecto
            map = L.map ('map', {
                zoomControl: false,
                attributionControl: false,
                maxBounds: ([[31.952,-18.808],[72.607,44.472]]),
                layers: [ptv_maps],
                //layers: [open_maps_mapnik],
                doubleClickZoom: false
            });

            map.setView ([41.505, -0.09], 13);

            /* Añadir un boton con los tiles disponibles */

            L.control.layers(baseLayers, overlays).addTo (map);
        },
        changeLayer: function(layer) {

        }
    }

});
