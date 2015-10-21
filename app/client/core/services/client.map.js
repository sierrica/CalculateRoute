app.factory ('Map', function($http, $translate) {

    /* TRANSLATE PTV POIS ATRIBUTES MAP */
    L.PtvLayer.TruckAttributes = L.PtvLayer.TruckAttributes.extend ({
        _formatTooltip: function (description) {
            /*var word = description.split("#")[1].toLowerCase();
            if ($translate.instant (word))
                return $translate.instant(word).charAt(0).toUpperCase() + $translate.instant(word).slice(1);
            else
        */
                return description;
        }
    });
    L.PtvLayer.TrafficInformation = L.PtvLayer.TrafficInformation.extend ({
        _formatTooltip: function (description) {
            console.log (description);
            var phrase = description.split("#")[1];
            return phrase.replace(/bei/i, '<b>' + $translate.instant ('at') + '</b>')
                         .replace(/Ein- und Ausfahrten gesperrt/i, '<b>' + $translate.instant ('exits locked') + '</b>')
                         .replace(/Unfall mit mehreren Fahrzeugen/i, '<b>' + $translate.instant ('accident involving several vehicles') + '</b>')
                         .replace(/Gefahr durch Gegenst\u00E4nde auf der Fahrbahn/i, '<b>' + $translate.instant ('danger of objects on the roadway') + '</b>')
                         .replace(/Gefahr durch defekten LKW/i, '<b>' + $translate.instant ('danger from defective truck') + '</b>')
                         .replace(/vor\u00FCbergehende Regelung mit provisorischen Ampeln/i, '<b>' + $translate.instant ('temporary basis with temporary traffic lights') + '</b>')
                         .replace(/Verkehrsbehinderung durch Bergungsarbeiten/i, '<b>' + $translate.instant ('traffic obstruction by salvage operations') + '</b>')
                         .replace(/Verkehrsbehinderung durch Untersp\u00FClung der Fahrbahn/i, '<b>' + $translate.instant ('traffic obstruction by undermining the roadway') + '</b>') //no va
                         .replace(/Verkehrsbehinderung durch Personen auf der Fahrbahn/i, '<b>' + $translate.instant ('traffic obstruction by people on the road') + '</b>')
                         .replace(/Ampelanlagensteuerung ge\u00E4ndert/i, '<b>' + $translate.instant ('changed traffic light control') + '</b>')
                         .replace(/Fahrbahn auf einen Fahrstreifen verengt/i, '<b>' + $translate.instant ('narrowed roadway on a lane') + '</b>')
                         .replace(/Fahrbahn auf zwei Fahrstreifen verengt/i, '<b>' + $translate.instant ('narrowed roadway to two lanes') + '</b>')
                         .replace(/linker Fahrstreifen gesperrt/i, '<b>' + $translate.instant ('left lane blocked') + '</b>')
                         .replace(/linker Fahrstreifen blockiert/i, '<b>' + $translate.instant ('left lane blocked') + '</b>')
                         .replace(/rechter Fahrstreifen gesperrt/i, '<b>' + $translate.instant ('right lane blocked') + '</b>')
                         .replace(/rechter Fahrstreifen blockiert/i, '<b>' + $translate.instant ('right lane blocked') + '</b>')
                         .replace(/Fahrzeug verungl\u00FCckt/i, '<b>' + $translate.instant ('accident vehicle') + '</b>')
                         .replace(/F\u00FCr beide Richtungen nur ein Fahrstreifen abwechselnd frei/i, '<b>' + $translate.instant ('for both directions only one lane turns freely') + '</b>')
                         .replace(/Gefahr durch Stra\u00DFensch\u00E4den/i, '<b>' + $translate.instant ('risk of road damage') + '</b>')
                         .replace(/Tank- und Rastanlage/i, '<b>' + $translate.instant ('petrol station and rest area') + '</b>')
                         .replace(/Tankstelle geschlossen/i, '<b>' + $translate.instant ('petrol station closed') + '</b>')
                         .replace(/Verkehrsbehinderung durch defektes Fahrzeug/i, '<b>' + $translate.instant ('traffic obstruction by defective vehicle') + '</b>')
                         .replace(/Ver\u00E4nderte Verkehrsf\u00FChrung im Baustellenbereich/i, '<b>' + $translate.instant ('changed traffic management at construction sites') + '</b>')
                         .replace(/Ver\u00E4nderte Verkehrsf\u00FChrung/i, '<b>' + $translate.instant ('changed traffic routing') + '</b>')
                         .replace(/ge\u00E4nderte Verkehrsf\u00FChrung/i, '<b>' + $translate.instant ('new traffic management') + '</b>')
                         .replace(/Standstreifen blockiert/i, '<b>' + $translate.instant ('blocked emergency lane') + '</b>')
                         .replace(/Behinderung durch Neugierige/i, '<b>' + $translate.instant ('obstruction by curious') + '</b>')
                         .replace(/Gefahr durch Personen auf der Fahrbahn/i, '<b>' + $translate.instant ('danger from people on the road') + '</b>')
                         .replace(/Gefahr durch ungesicherte Unfallstelle/i, '<b>' + $translate.instant ('danger due to unsecured accident site') + '</b>')
                         .replace(/Verkehrsbehinderung durch umgest\u00FCrzte B\u00E4ume/i, '<b>' + $translate.instant ('traffic obstruction by fallen trees') + '</b>')
                         .replace(/Fahrstreifen abwechselnd frei/i, '<b>' + $translate.instant ('lane alternately free') + '</b>')
                         .replace(/Verkehrsbehinderung durch Steinschlag/i, '<b>' + $translate.instant ('traffic obstruction by rockfall') + '</b>')
                         .replace(/Verkehrsbehinderung durch Gro\u00DFbrand/i, '<b>' + $translate.instant ('traffic obstruction by major fire') + '</b>')
                         .replace(/Durchfahrt gesperrt f\u00FCr Schwerlastverkehr/i, '<b>' + $translate.instant ('transit closed for heavy goods vehicles') + '</b>')
                         .replace(/Gefahr durch Tiere auf der Fahrbahn/i, '<b>' + $translate.instant ('danger of animals on the road') + '</b>')
                         .replace(/Gefahr durch defektes Fahrzeug/i, '<b>' + $translate.instant ('danger from defective vehicle') + '</b>')
                         .replace(/mittlerer Fahrstreifen blockiert/i, '<b>' + $translate.instant ('blocked middle lane') + '</b>')
                         .replace(/Ampeln ausgefallen/i, '<b>' + $translate.instant ('failed traffic lights') + '</b>')
                         .replace(/Unfall mit LKW/i, '<b>' + $translate.instant ('accident with truck') + '</b>')
                         .replace(/Unfall/i, '<b>' + $translate.instant ('accident') + '</b>')
                         .replace(/Ausfahrt gesperrt/i, '<b>' + $translate.instant ('exit locked') + '</b>')
                         //Weinstraﬂe gesperrt
                         //Anschluﬂstelle gesperrt
                         .replace(/Pannenstreifen gesperrt/i, '<b>' + $translate.instant ('hard shoulder blocked') + '</b>')
                         .replace(/Einfahrt gesperrt/i, '<b>' + $translate.instant ('driveway blocked') + '</b>')
                         .replace(/Einfahrt gesperrt/i, '<b>' + $translate.instant ('junction blocked') + '</b>')
                         .replace(/Gesperrt/i, '<b>' + $translate.instant ('blocked') + '</b>')
                         .replace(/gesperrt/i, '<b>' + $translate.instant ('blocked') + '</b>')
                         .replace(/dichter Verkehr/i, '<b>' + $translate.instant ('heavy traffic') + '</b>')
                         .replace(/Stau/i, '<b>' + $translate.instant ('traffic jam') + '</b>')
                         .replace(/stockender Verkehr/i, '<b>' + $translate.instant ('halting traffic') + '</b>')
                         .replace(/Gewitter/i, '<b>' + $translate.instant ('thunderstorm') + '</b>')
                         .replace(/Dauerbaustelle/i, '<b>' + $translate.instant ('oeuvre') + '</b>')
                         .replace(/Tagesbaustelle/i, '<b>' + $translate.instant ('oeuvre') + '</b>')
                         .replace(/Baustelle/i, '<b>' + $translate.instant ('oeuvre') + '</b>')
                         .replace(/Richtung/i, '<b>' + $translate.instant ('direction') + '</b>')
                         .replace(/Tiefbauarbeiten/i, '<b>' + $translate.instant ('public works') + '</b>')
                         .replace(/Br\u00FCckenabriss/i, '<b>' + $translate.instant ('bridge demolition') + '</b>')
                         .replace(/Br\u00FCckenarbeiten/i, '<b>' + $translate.instant ('bridges works') + '</b>')
                         .replace(/Br\u00FCckenarenten/i, '<b>' + $translate.instant ('bridges works') + '</b>')
                         .replace(/Markierungsarbeiten/i, '<b>' + $translate.instant ('working') + '</b>')
                         .replace(/Arbeiten/i, '<b>' + $translate.instant ('working') + '</b>')
                         .replace(/Fahrstreifen/i, '<b>' + $translate.instant ('lane') + '</b>')
                         .replace(/Instandhaltungsarbeiten/i, '<b>' + $translate.instant ('maintenance work') + '</b>')
                         .replace(/Fahrbahnverengung/i, '<b>' + $translate.instant ('lane closure') + '</b>')
                         .replace(/verlorene ladung/i, '<b>' + $translate.instant ('lane closure') + '</b>')
                         .replace(/Fahrbahnerneuerung/i, '<b>' + $translate.instant ('road renovation') + '</b>')
                         .replace(/Sicherheitsvorfall/i, '<b>' + $translate.instant ('security incident') + '</b>');
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



    var token = '2aae51c7-a403-4118-8749-f41045e36f40';
    var cluster = 'eu-n-test';
    var xMapUrl = 'https://xmap-' + cluster + '.cloud.ptvgroup.com';







    /* BASELAYERS */

    // Tile PTV Maps
    var ptv_maps_bg = L.tileLayer ('https://ajaxbg{s}-eu-n-test.cloud.ptvgroup.com/WMS/GetTile/xmap-ajaxbg/{x}/{y}/{z}.png', {
        subdomains: '1234',
        minZoom: 3,
        opacity: 1.0
    });

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


    window.onresize = function() {
        console.log ("ANCHURA: " + $(window).width());
        console.log ("ALTURA: " + $(window).width());
        if ($(window).width() > 992)
            $("#map").css ("width", $(window).width() - 300);
        else
            $("#map").css ("width", $(window).width());
        $("#map").css ("height", $(window).height() - 50);
    };


    var map;
    var map_html;
    var marker_bug_restaure;
    var circle_manoeuvre;
    var letters = ['A','B','C','D','E','F','G','H','I','J'];

    var list_markers_stations = [];
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

    return {
        IconPushpin: icon_pushpin,
        IconLoading: icon_loading,
        Letters: letters,
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
        getWaypoints: function() {
            var waypoints = [];
            for (i=0; i<list_markers_stations.length; i++)
                waypoints.push (list_markers_stations[i].getLatLng())
            return waypoints;
        },
        getMap: function () {
            return map;
        },
        setMap: function(mapa) {
            map = mapa;
            map.addLayer (cluster_markers_stations);

            // NECESARIO HACER AQUI POR EL "pane"
            var ptv_maps_fg = new L.NonTiledLayer.WMS ('https://ajaxfg-eu-n-test.cloud.ptvgroup.com/WMS/WMS?xtok=' + token, {
                minZoom: 3, opacity: 1.0, layers: 'xmap-ajaxfg', format: 'image/png', transparent: true, attribution: false, zIndex: 100, pane: map.getPanes().tilePane
            });



            var ptv_maps = L.layerGroup ([ptv_maps_bg, ptv_maps_fg]);

            var base_layers = {
                "GOOGLE": google_maps,
                "PTV": ptv_maps,
                "MAPNIK": open_maps_mapnik,
                "ROAD": open_maps_road
            };

            L.control.layers (base_layers, overlays).addTo (map);


        },
        saveMapHtml: function() {
            map_html = map.getContainer();
        },
        restoreMapHtml: function() {
            return map_html;
        },
        addMarkerBugRestaure: function() {
            if (marker_bug_restaure)
                map.removeLayer(marker_bug_restaure);
            marker_bug_restaure = L.marker([0, 0], {opacity: 0.0}).addTo(map);
        },
        lengthMarkerStations: function() {
            return list_markers_stations.length;
        },
        getMarkersStations: function() {
            return list_markers_stations;
        },
        getMarkerStation: function(index) {
            return list_markers_stations[index];
        },
        addMarkerStation: function (marker, index) {
            list_markers_stations.splice (index, 0, marker);
            cluster_markers_stations.clearLayers();
            cluster_markers_stations.addLayers (list_markers_stations);
        },
        removeMarkerStation: function (index) {
            var marker = list_markers_stations[index];
            list_markers_stations.splice (index, 1);
            cluster_markers_stations.removeLayer (marker);
        },
        setMarkerStation: function (marker, index) {
            list_markers_stations[i] = marker;
            cluster_markers_stations.addLayer (marker);
        },
        setClusterMarkerStation: function (marker) {
            cluster_markers_stations.clearLayers();
            cluster_markers_stations.addLayers (list_markers_stations);
        },
        formatDirPopup: function (dir, br) {
            var popup = '';
            popup += dir.street;
            if (dir.detaillevel > 6)
                popup += ', ' + dir.housenr + ', ';
            if (dir.streetnumber  &&  dir.streetnumber != "")
                popup += ' (' + dir.streetnumber + '),';
            if (br) {
                popup += '<br>';
                popup += dir.postcode + ', ' + dir.city;
            }
            else
                popup += ' ' + dir.postcode + ', ' + dir.city;
            if (dir.district != "")
                popup += ' - ' + dir.district + '';
            if (br)
                popup += '<br>';
            else
                popup += ', ';
            if (dir.province != "")
                popup += dir.province;
            popup += ', ' + dir.state + ' - (' + dir.country + ')';
            return popup;
        },
        getCircleManoeuvre: function() {
            return circle_manoeuvre;
        },
        setCircleManoeuvre: function(circle) {
            if (circle_manoeuvre)
                map.removeLayer(circle_manoeuvre);
            circle_manoeuvre = circle;
            circle_manoeuvre.addTo (map);
        },
        removeCircleManoeuvre: function() {
            if (circle_manoeuvre)
                map.removeLayer(circle_manoeuvre);
            //circle_manoeuvre = null;
        }
    }
});
