app.factory ('Map', function($http, $translate) {

    /* TRANSLATE PTV POIS ATRIBUTES MAP */
    L.PtvLayer.TruckAttributes = L.PtvLayer.TruckAttributes.extend ({
        _formatTooltip: function (description) {
 /*           var word = description.split("#")[1].toLowerCase();
            if ($translate.instant (word))
                return $translate.instant(word).charAt(0).toUpperCase() + $translate.instant(word).slice(1);
            else
           */
                return description;
        }
    });
    L.PtvLayer.TrafficInformation = L.PtvLayer.TrafficInformation.extend ({
        _formatTooltip: function (description) {
            var word = description.split("#")[1].toLowerCase();
            if ($translate.instant (word))
                return $translate.instant(word).charAt(0).toUpperCase() + $translate.instant(word).slice(1);
            else
                return description;

        }
    });


    /* ICONS */
    L.Icon.Default.imagePath = 'images';

    L.NumberedDivIcon = L.Icon.extend ({
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
        createShadow: function () {         //you could change this to add a shadow like in the normal marker if you really wanted
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



    var token = 'c2b345bf-ae76-4f41-8467-6307423b1bf4';
    var cluster = 'eu-n-test';
    var xMapUrl = 'https://xmap-' + cluster + '.cloud.ptvgroup.com';


    /* BASELAYERS */
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
    var base_layers = {
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



    window.onresize = function () {
        $("#map").css ("width", $("#mapContainer").parent().width());
        $("#map").css ("height", window.innerHeight - 50);
    };

    var map;
    var map_html;
    var letters = ['A','B','C','D','E','F','G','H','I','J'];


    var cluster_markers_stations = new L.MarkerClusterGroup ({
        maxClusterRadius: 80,
        iconCreateFunction: null,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        singleMarkerMode: false,
        disableClusteringAtZoom: null,
        removeOutsideVisibleBounds: true,
        animateAddingMarkers: false,
        spiderfyDistanceMultiplier: 1,
        polygonOptions: {}
    });
    var list_markers_stations = [];
    return {
        getBaseLayers: function() {
            return base_layers;
        },
        getLayer: function(layer) {
            if (layer == 'google_maps')
                return google_maps;
            else if (layer == 'open_maps_mapnik')
                return open_maps_mapnik;
            else if (layer == 'open_maps_road')
                return google_maps;
            else if (layer == 'ptv_maps')
                return ptv_maps;
        },
        getOverlays: function() {
          return overlays;
        },
        removeMap: function() {
            map.remove();
        },
        getMap: function () {
            return map;
        },
        setMap: function(mapa) {
            map = mapa;
            map.addLayer (cluster_markers_stations);
        },
        saveMapHtml: function() {
            map_html = map.getContainer();
        },
        restoreMapHtml: function() {
            return map_html;
        },

        IconPushpin: icon_pushpin,
        IconLoading: icon_loading,
        Letters: letters,
        lengthMarkerStations: function() {
            return list_markers_stations.length;
        },
        getMarkersStations: function() {
            return list_markers_stations;
        },
        removeMarkersStations: function() {
            list_markers_stations = [];
            cluster_markers_stations.clearLayers();
        },
        setMarkersStations: function (markers) {
            list_markers_stations = markers;
            cluster_markers_stations.addLayers (markers);
        },
        getMarkerStation: function(index) {
            return list_markers_stations[index];
        },
        setMarkerStation: function (marker, index) {
            list_markers_stations[i] = marker;
            cluster_markers_stations.addLayer (marker);
        },
        addMarkerStation: function (marker, index) {
            list_markers_stations.splice (index, 0, marker);
            cluster_markers_stations.addLayer (marker);
        },
        removeMarkerStation: function (index) {
            var marker = list_markers_stations[index];
            list_markers_stations.splice (index, 1);
            cluster_markers_stations.removeLayer (marker);
        },
        formatDirPopup: function (dir) {
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
        }
    }
});