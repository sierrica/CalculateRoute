var request = require ('request'),
    btoa    = require ('btoa');


var token = 'c2b345bf-ae76-4f41-8467-6307423b1bf4';
var headers = {
    'Authorization': 'Basic ' + btoa ('xtok:' + token),
    'Content-Type': 'application/json'
};

var callerContext = {
    properties: [{
        key: 'CoordFormat',
        value: 'OG_GEODECIMAL'
    }, {
        key: 'ResponseGeometry',
        value: 'PLAIN'                      // PLAIN, WKB, WKT
    }, {
        key : 'Profile',
        value : 'default'
    }]
};


exports.findlocation = function (req, res) {
    var body = {
        location: {
            coordinate: {
                point: {
                    x: req.body.lng,
                    y: req.body.lat
                }
            }
        },
        additionalFields: [
            "HOUSENR",
            "STREET",
            "STREETNUMBER",
            "POSTCODE",
            "CITY",
            "CITY2",
            "PROVINCE",
            "STATE",
            "COUNTRY",
            "SEGMENT_ID",
            "SEGMENT_COUNTRY",
            "SEGMENT_DIRECTION",
            "COORDX",
            "COORDY",
            "DETAILLEVEL",
            "POPULATION",
            "XYN",
            "CITY_LEVEL",
            "HOUSENR_ATINPUTCOORDINATESIDE"
        ],
        callerContext: callerContext
    };

    var options = {
        url: 'https://xlocate-eu-n-test.cloud.ptvgroup.com/xlocate/rs/XLocate/findLocation',
        headers: headers,
        json: true,
        body: body
    };

    request.post (options, function (error, response, body) {
        if (error) {
            console.log(error);
            res.status(500).json (error);
        }
        if (body.errorCode == 0   &&   body.resultList.length == 0)
            res.status(404).json ({ result: {}, result_ptv: body });
        else {
            var first_result = body.resultList[0];
            var result = {
                housenr: first_result.additionalFields[0].value,
                street: first_result.additionalFields[1].value,
                streetnumber: first_result.additionalFields[2].value,
                postcode: first_result.additionalFields[3].value,
                city: first_result.additionalFields[4].value,
                district: first_result.additionalFields[5].value,
                province: first_result.additionalFields[6].value,
                state: first_result.additionalFields[7].value,
                country: first_result.additionalFields[8].value,
                segment_id: first_result.additionalFields[9].value,
                segment_country: first_result.additionalFields[10].value,
                segment_direction: first_result.additionalFields[11].value,
                coord_x_request: req.body.lng,
                coord_x_response: first_result.additionalFields[12].value,
                coord_y_request: req.body.lat,
                coord_y_response: first_result.additionalFields[13].value,
                detaillevel: first_result.additionalFields[14].value,
            };
            res.status(200).json ({ result: result, result_ptv: body });
        }
    });
};

exports.calculateroute = function(req, res) {
    var peticion = {};

    peticion.waypoints = [];
    for (i=0; i<req.body.waypoints.length; i++) {
        peticion.waypoints.push ({
            coords: [{
                point: {
                    x: req.body.waypoints[i].lng,
                    y: req.body.waypoints[i].lat
                }
            }],
            linkType: 'NEXT_SEGMENT'
        });
    }

    peticion.details = req.body.options.details;
    //peticion.details.manoeuvreAttributes = true,

    peticion.details.detailLevel = 'STANDARD';
    peticion.details.polygon = true;

    peticion.options= [];

    peticion.callerContext = callerContext;
    peticion.exceptionPaths = [];

/*
    var peticion = {
        waypoints: [{
            coords: [{
                point: {
                    : -0.98397434992,
                    y: 41.651353453
                }
            }],
            linkType: 'NEXT_SEGMENT'
        }, {
            coords: [{
                point: {
                    x: -1.13744,
                    y: 42.12921
                }
            }],
            linkType: 'NEXT_SEGMENT'
        }],
        callerContext: callerContext,
        options: [],
        exceptionPaths: [],
        details: {
            binaryPathDesc: false,
            manoeuvreAttributes: false,
            manoeuvres: false,
            nodes: false,
            polygon: false,
            polygonElevations: false,
            segmentAttributes: false,
            segments: false,
            speedLimits: false,
            texts: false,
            urbanManoeuvres: false
        }
    };
*/

    console.log ("PETICION");
    console.log (peticion);

    var options = {
        url: 'https://xroute-eu-n-test.cloud.ptvgroup.com/xroute/rs/XRoute/calculateRoute',
        headers: headers,
        json: true,
        body: peticion
    };

    request.post (options, function (error, response, body) {
        if (error) {
            console.log ("ERROR");
            console.log (error)
            res.json (error);
        }
        console.log ("EXITO");
        console.log (body)
        res.json (body);
    });
};
