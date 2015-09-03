var path            = require ('path'),
    Ptv     = require (path.resolve('./app/server/ptv/models/server.ptv.model')),
    request = require ('request'),
    btoa    = require ('btoa')
    moment  = require ('moment');


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


exports.findaddress = function(req, res) {


    var body = {
        address: req.body.address,
        additionalFields: [
            "HOUSENR",
            "STREET",
            "POSTCODE",
            "CITY",
            "CITY2",
            "PROVINCE",
            "STATE",
            "COUNTRY",
            "COUNTRY_NAME",
            "COORDX",
            "COORDY",
            "DETAILLEVEL"
        ],
        callerContext: callerContext
    }

    var options = {
        url: 'https://xlocate-eu-n-test.cloud.ptvgroup.com/xlocate/rs/XLocate/findAddressByText',
        headers: headers,
        json: true,
        body: body
    };

    request.post (options, function (error, response, body) {
        if (error) {
            console.log(error);
            res.status(500).json(error);
        }
        if (body.errorCode == 0 && body.resultList.length == 0)
            res.status(404).json({result: {}, result_ptv: body});
        else {

            var directions = [];
            for (i=0; i<body.resultList.length; i++) {
                console.log (body.resultList[i]);
                directions.push ({
                    housenr: body.resultList[i].additionalFields[0].value,
                    street: body.resultList[i].additionalFields[1].value,
                    postcode: body.resultList[i].additionalFields[2].value,
                    city: body.resultList[i].additionalFields[3].value,
                    district: body.resultList[i].additionalFields[4].value,
                    province: body.resultList[i].additionalFields[5].value,
                    state: body.resultList[i].additionalFields[6].value,
                    country: body.resultList[i].additionalFields[7].value,
                    country_name: body.resultList[i].additionalFields[8].value,
                    coord_x_response: body.resultList[i].additionalFields[9].value / 100000,
                    coord_y_response: body.resultList[i].additionalFields[10].value / 100000,
                    detaillevel: body.resultList[i].additionalFields[11].value,
                    score: body.resultList[i].totalScore
                })
            }
            res.status(200).json ({ result: directions, result_ptv: body });
        }
    });

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
    console.log ("FECHA: " + moment.utc().format());


    peticion.options= [{
        parameter: 'ROUTE_LANGUAGE',
        value: req.user.lang.split('-')[0].toUpperCase()
    }, {
        parameter: 'START_TIME',
        value: moment.utc().format()
    }, {
        parameter: 'AVOID_TOLLROADS',
        value: req.body.options.trayect.tollroads
    }, {
        parameter: 'AVOID_HIGHWAYS',
        value: req.body.options.trayect.highways
    }];

    var deliveryBasicDataRules = '', deliveryLegalCondition = '';
    if (req.body.options.vehicle.isDelivery) {
        deliveryBasicDataRules = '<BasicDataRules><VehicleSpecific><DeliveryVehicles segmentMalus="2500"/></VehicleSpecific></BasicDataRules>';
        deliveryLegalCondition = '<Legal><LegalCondition isAuthorized="true" isDelivery="true"/></Legal>';
    }
    //var weight = '<Weight emptyWeight="' + document.getElementById("weight").value + '"/>';
    var dimension = '<Dimension height="' + req.body.options.vehicle.height + '" width="' + req.body.options.vehicle.width + '" />';

    var snippet ='<Profile xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><FeatureLayer majorVersion="1" minorVersion="0"><GlobalSettings enableVehicleDependency="true"/><Themes><Theme id="PTV_TruckAttributes" enabled="true"></Theme></Themes></FeatureLayer><Routing majorVersion="2" minorVersion="0">'
        + '<Course>' + deliveryBasicDataRules + '<AdditionalDataRules enabled="true"><VehicleSpecific enabled="false"/></AdditionalDataRules></Course>'
        + '<Vehicle><Physical>' + dimension + '</Physical>' + deliveryLegalCondition + '</Vehicle></Routing></Profile>';

    var callerContext_truck = {
        properties: [{
            key: "Profile",
            value: "truckfast"
        },{
            key: "ProfileXMLSnippet",
            value: snippet
        }, {
            "key": "CoordFormat",
            "value": "OG_GEODECIMAL"
        }]
    };
    peticion.callerContext = callerContext_truck;


    peticion.details = req.body.options.details;
    //peticion.details.manoeuvreAttributes = true,

    peticion.details.detailLevel = 'STANDARD';
    peticion.details.polygon = true;
    peticion.details.segments = true;




    peticion.exceptionPaths = [];

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

        Ptv.findById (req.user._id, function (err, options) {
            if (err)
                return res.status(400).send ( err );
            options.vehicle = req.body.options.vehicle;
            options.trayect = req.body.options.trayect;
            options.details = req.body.options.details;
            options.save (function (err) {
                if (err)
                    return res.status(400).send ( err );
                res.json (body);
            });
        });
    });
};
