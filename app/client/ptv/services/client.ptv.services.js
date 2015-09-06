app.factory ('Ptv', function($resource, Map) {

    var car_profile = {
        vehicle: {
            lengt: 420, width: 176, height: 151,
            emptyweight: 1400, totalweight: 1770, trailerweight: 0, loadweight: 0, loadtype: 'PASSENGER', maximumpassengers: 5,
            axlenumber: 2, axleload: 890, axleheight: 100,
            cylinder: 2200, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };

    var default_profile = car_profile;

    var van_profile = {
        vehicle: {
            lengt: 600, width: 200, height: 255,
            emptyweight: 2100, totalweight: 3500, trailerweight: 0, loadweight: 0, loadtype: 'MIXED', maximumpassengers: 5,
            axlenumber: 2, axleload: 1800, axleheight: 140,
            cylinder: 2200, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };
    var truck_75_profile = {
        vehicle: {
            lengt: 720, width: 250, height: 340,
            emptyweight: 4000, totalweight: 7500, trailerweight: 0, loadweight: 0, loadtype: 'GOODS', maximumpassengers: 3,
            axlenumber: 2, axleload: 2200, axleheight: 340,
            cylinder: 1600, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };
    var truck_1199_profile = {
        vehicle: {
            lengt: 1000, width: 255, height: 380,
            emptyweight: 6900, totalweight: 11990, trailerweight: 0, loadweight: 0, loadtype: 'GOODS', maximumpassengers: 3,
            axlenumber: 2, axleload: 8100, axleheight: 380,
            cylinder: 1600, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };
    var truck_40_profile = {
        vehicle: {
            lengt: 1800, width: 255, height: 400,
            emptyweight: 10000, totalweight: 40000, trailerweight: 5000, loadweight: 25000, loadtype: 'GOODS', maximumpassengers: 3,
            axlenumber: 5, axleload: 11500, axleheight: 400,
            cylinder: 12000, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };
    var trailer_truck_profile = {
        vehicle: {
            lengt: 1650, width: 255, height: 400,
            emptyweight: 6900, totalweight: 11990, trailerweight: 5000, loadweight: 10000, loadtype: 'GOODS', maximumpassengers: 3,
            axlenumber: 5, axleload: 10000, axleheight: 400,
            cylinder: 12000, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };
    var transporter_profile = {
        vehicle: {
            lengt: 1650, width: 255, height: 360,
            emptyweight: 6900, totalweight: 11990, trailerweight: 0, loadweight: 0, loadtype: 'PASSENGER', maximumpassengers: 40,
            axlenumber: 2, axleload: 8100, axleheight: 360,
            cylinder: 10000, typefuel: 'DIESEL',
            emmissionclass: 'EURO_5'
        }
    };



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
        getOptionsDefault: function(type) {
            return (type=='default') ? default_profile :
                   (type=='car') ? car_profile :
                   (type=='van') ? van_profile :
                   (type=='truck-7.5t') ? truck_75_profile :
                   (type=='truck-11.99t') ? truck_1199_profile :
                   (type=='truck-40t') ? truck_40_profile :
                   (type=='trailer-truck') ? trailer_truck_profile :
                   transporter_profile;
            /*
            return (type=='default') ? angular.extend (options, default_profile) :
                   (type=='car') ? angular.extend (options, car_profile) :
                   (type=='van') ? angular.extend (options, van_profile) :
                   (type=='truck-7.5t') ? angular.extend (options, truck_75_profile) :
                   (type=='truck-11.99t') ? angular.extend (options, truck_1199_profile) :
                   (type=='truck-40t') ? angular.extend (options, truck_40_profile) :
                   (type=='trailer-truck') ? angular.extend (options, trailer_truck_profile) :
                   angular.extend (options, transporter_profile);
                   */
        },
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