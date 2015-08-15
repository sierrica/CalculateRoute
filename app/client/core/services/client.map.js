app.factory('Map', function($http, $translate) {

    var token = 'c2b345bf-ae76-4f41-8467-6307423b1bf4';
    var cluster = 'eu-n-test';
    var xMapUrl = 'https://xmap-' + cluster + '.cloud.ptvgroup.com';

    L.Icon.Default.imagePath = 'images';



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







    L.NumberedDivIcon = L.Icon.extend({
        options: {
            // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
            iconUrl: 'images/marker-icon-fill.png',
            letter: '',
            shadowUrl: null,
            iconSize: new L.Point(25, 41),
            iconAnchor: new L.Point(13, 41),
            popupAnchor: new L.Point(0, -33),
            className: 'leaflet-div-icon'
        },

        createIcon: function () {
            var div = document.createElement('div');
            var img = this._createImg(this.options['iconUrl']);
            var numdiv = document.createElement('div');
            numdiv.setAttribute ( "class", "number" );
            numdiv.innerHTML = this.options['letter'] || '';
            div.appendChild ( img );
            div.appendChild ( numdiv );
            this._setIconStyles(div, 'icon');
            return div;
        },

        //you could change this to add a shadow like in the normal marker if you really wanted
        createShadow: function () {
            return null;
        }
    });




    var icon_loading = L.AwesomeMarkers.icon ({
        prefix: 'fa',
        icon: 'spinner',
        markerColor: 'blue',
        spin: true
    });

    var icon_pushpin = L.icon({
        iconUrl: 'images/pushpin-pink.png',
        //shadowUrl: 'images/pushpin-pink.png',
        iconSize:     [40, 53], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [24, 52], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });



    var format_dir_popup = function (dir) {
        var popup = '';
        popup += dir.street;
        if (dir.detaillevel > 6)
            popup += ', ' + dir.housenr;
        if (dir.streetnumber != "")
            popup += ' <b>(' + dir.streetnumber + ')</b>';
        popup += '<br>';
        popup += dir.postcode + ', ' + dir.city;
        if (dir.district != "")
            popup += ' - <u><i>' + dir.district + '<i/></u>';
        popup += '<br>';
        if ((dir.province != ""))
            popup += dir.province + ', ';
        popup += dir.state + ' - <b>(' + dir.country + ')<b>';
        return popup;
    };


    var delete_marker = function (e) {
        console.log ("DELETE MARKER");
        //console.log (_.indexOf(markers_stations, marker_select));
        map.removeLayer (markers_stations[index_marker_selected]);


        markers_stations.splice (index_marker_selected, 1);         // REMOVE
        for (i=index_marker_selected; i<markers_stations.length; i++)
            markers_stations[i].setIcon (new L.NumberedDivIcon ({letter: letters[i]}));
        //.each(function( index ) {
        //markers_stations.length -= 1;

    };



    var letters = ['A','B','C','D','E','F','G','H','I','J'];
    var markers_stations = [];
    var dragstart_latlng;

    var add_origin = function (ev) {
        add (ev, 0);
    };
    var add_destine = function (ev) {
        add (ev, markers_stations.length);
    };
    var add_intermedie = function (ev) {
        add (ev, 1);
    };

    var index_marker_selected;
    var add = function (e, index) {
        var marker_pre = L.marker (e.latlng, {icon: icon_loading}).addTo (map);
        $http.post ('/ptv/findlocation', e.latlng)
        .success (function(response, response_ptv) {
            //console.log ("EXITO");
            map.removeLayer (marker_pre);
            var marker = L.marker (e.latlng, {
                icon: new L.NumberedDivIcon ({letter: letters[index]}),
                draggable: true,
                contextmenu: true,
                contextmenuInheritItems: false,
                contextmenuItems: [{
                    text: 'borrar',
                    index: 3,
                    callback: delete_marker,
                    context: marker
                }]
            })
            .on ("dragstart", function(ev) {
                dragstart_latlng = ev.target.getLatLng();
            })
            .on ("dragend", function(ev) {
                ev.target.setOpacity (0.0);
                marker_pre = L.marker (ev.target.getLatLng(), {icon: icon_loading}).addTo (map);
                $http.post ('/ptv/findlocation', ev.target.getLatLng())
                .success (function(response) {
                    map.removeLayer (marker_pre);
                    ev.target.setOpacity(1);
                    ev.target.openPopup().getPopup().setContent(format_dir_popup (response.result));
                })
                .error (function(response, status) {
                    if (status == 404) {
                        console.log("PUNTO IMPOSIBLE DE LOCALIZAR");
                        Materialize.toast ('<span class="red">' + 'PUNTO IMPOSIBLE DE LOCALIZAR' + '</span>', 4000);
                        map.removeLayer (marker_pre);
                        ev.target.setLatLng (dragstart_latlng);
                        ev.target.update();
                        ev.target.setOpacity (1);
                    }
                });
            })
            .on ("contextmenu", function(ev) {
                console.log ("DENTRO CONTEXT OVERRIDE");
                var marker_selected = ev.target;
                index_marker_selected = _.indexOf (markers_stations, marker_selected);
            })
            .bindPopup (format_dir_popup(response.result))
            .addTo (map)
            .openPopup();

            markers_stations.splice (index, 0, marker);                 //ADD
            for (i=index; i<markers_stations.length; i++)
                markers_stations[i].setIcon (new L.NumberedDivIcon ({letter: letters[i]}));
            console.log ("MARKERS");
            console.log (markers_stations);
        })
        .error (function(response, status) {
            if (status == 404) {
                map.removeLayer (marker_pre);
                console.log ("PUNTO IMPOSIBLE DE LOCALIZAR");
                Materialize.toast ('<span class="red">' + 'PUNTO IMPOSIBLE DE LOCALIZAR' + '</span>', 4000);
            }
        });
    };

    var map;
    window.onresize = function () {
        $("#map").css ("width", $("#mapContainer").parent().width());
        $("#map").css ("height", window.innerHeight - 50);
    };


    var pointer_marker;
    return {
        initMap: function(container) {
            $("#map").css ("width", $("#mapContainer").parent().width());
            $("#map").css ("height", window.innerHeight - 50);
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
                    index: 0,
                    icon: 'images/flecha_verde.png',
                    text: 'origen',
                    callback: add_origin
                }, {
                    index: 1,
                    icon: 'images/flecha_verde.png',
                    text: 'intermedio',
                    callback: add_intermedie
                }, {
                    index: 2,
                    icon: 'images/flecha_verde.png',
                    text: 'destino',
                    callback: add_destine
                }]
            })
            .on ('contextmenu', function(ev) {
                if (pointer_marker)
                    map.removeLayer (pointer_marker);
                pointer_marker = L.marker (ev.latlng, { icon: icon_pushpin }).addTo (map);
            })
            .on ('contextmenu.hide', function(contextmenu, relatedTarget) {
                map.removeLayer (pointer_marker);
            })
            .on ('contextmenu:select', function(contextmenu, el) {

                console.log ('contextmenu:select : ' + $("div.leaflet-contextmenu a").index(contextmenu.el));
                console.log (contextmenu);
                console.log (el);
                var index_select = $("div.leaflet-contextmenu a").index(contextmenu.el);
            })
            .setView ([41.9204014, -1.2529047000000446], 18);

            L.control.layers (baseLayers, overlays).addTo (map);            /* Añadir un boton con los tiles disponibles */
        }
    }
});
