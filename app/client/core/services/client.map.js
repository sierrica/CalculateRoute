app.factory ('Map', function($http, $translate) {

    /* TRANSLATE PTV POIS ATRIBUTES MAP */
    L.PtvLayer.TruckAttributes = L.PtvLayer.TruckAttributes.extend ({
        _formatTooltip: function (description) {
            var word = description.split("#")[1].toLowerCase();
            if ($translate.instant (word))
                return $translate.instant(word).charAt(0).toUpperCase() + $translate.instant(word).slice(1);
            else
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

    window.onresize = function () {
        $("#map").css ("width", $("#mapContainer").parent().width());
        $("#map").css ("height", window.innerHeight - 50);
    };

    var letters = ['A','B','C','D','E','F','G','H','I','J'];
    var markers_stations = [];
    return {
        IconPushpin: icon_pushpin,
        IconLoading: icon_loading,
        Letters: letters,
        MarkersStations: markers_stations,
        getLayers: function (tilelayers_names) {
            var layers = [];
            if (_.indexOf(tilelayers_names, 'ptv_maps') != -1)
                layers.push (ptv_maps);
            return layers;
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
