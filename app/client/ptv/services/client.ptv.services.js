app.factory ('Ptv', function($resource, Map) {

    var options = {};

    var results = {
        polygon: [],
        info: { cost: 0, distance: 0, time: 0 },
        manoeuvres: []
    };

    return {
        myoptions: $resource ('myoptions', {}, {
            'update': { method: 'PUT' }
        }),
        getOptions: function (type) {
            return options;
        },
        setOptions: function(new_options) {
            options = angular.extend (options, new_options);
        },
        getResults: function() {
            return results;
        },
        setResults: function(new_results) {
            results = angular.extend (results, new_results);
        },
        parseManoeuvres: function(manoeuvres, stations, segments) {
            var parsed_manoeuvres = [];
            for (i=0; i<manoeuvres.length; i++) {
                var type = manoeuvres[i].manoeuvreType;
                var orient = manoeuvres[i].turnOrient;
                var icon = '';
                if (type=='UTURN' || type=='ENTER_RA' || type=='STAY_RA' || type=='EXIT_RA_ENTER' || type=='EXIT_RA_ENTER_FERRY')
                    icon = 'leaflet-routing-icon-enter-roundabout';
                else if (type=='FURTHER' || type=='KEEP' || type=='CHANGE' || type=='ENTER' || type=='EXIT' || type=='ENTER_FERRY' || type=='EXIT_FERRY')
                    icon = (orient == 'LEFT') ? 'leaflet-routing-icon-turn-left' : (orient == 'RIGHT') ? 'leaflet-routing-icon-turn-right' : 'leaflet-routing-icon-continue'
                else if (type=='TURN') {
                    if (orient == 'LEFT')
                        icon = (manoeuvres[i].turnWeight == 'HALF') ? 'leaflet-routing-icon-bear-left' : (manoeuvres[i].turnWeight == 'STRONG') ? 'leaflet-routing-icon-sharp-left' : 'leaflet-routing-icon-turn-left';
                    else if (orient == 'RIGHT')
                        icon = (manoeuvres[i].turnWeight == 'HALF') ? 'leaflet-routing-icon-bear-right' : (manoeuvres[i].turnWeight == 'STRONG') ? 'leaflet-routing-icon-sharp-right' : 'leaflet-routing-icon-turn-right';
                    else
                        icon = 'leaflet-routing-icon-enter-roundabout';
                }
                else
                    icon = 'leaflet-routing-icon-continue';

                parsed_manoeuvres.push ({
                    icon: icon,
                    description: manoeuvres[i].manoeuvreDesc,
                    distance: segments[manoeuvres[i].succSegmentIdx].accDist,
                    index: segments[manoeuvres[i].succSegmentIdx].firstPolyIdx,
                    time: segments[manoeuvres[i].succSegmentIdx].accTime,
                });
            }
            for (var i = stations.length - 1; i >= 0; i--) {
                parsed_manoeuvres.splice (stations[i].manoeuvreIdx, 0, {
                    icon: (i == stations.length - 1) ? "leaflet-routing-icon-arrive" : (i == 0) ? "leaflet-routing-icon-depart" : "leaflet-routing-icon-via",
                    description: (i == stations.length - 1) ? "Destino" : (i == 0) ? "Origen" : "Intermedio " + i,
                    distance: stations[i].accDist,
                    index: stations[i].polyIdx,
                    time: stations[i].accTime
                });
            }
            //console.log ("PARSED MANOUVRES")
            //console.log (parsed_manoeuvres);
            return parsed_manoeuvres;
        }
    }
});