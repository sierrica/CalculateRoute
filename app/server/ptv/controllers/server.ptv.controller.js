var request = require ('request'),
    btoa    = require ('btoa');

exports.calculateroute = function(req, res) {

    var peticion = {
        waypoints: [{
            coords: [{
                point: {
                    x: -0.98397434992,
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
        callerContext: {
            properties: [{
                key: 'CoordFormat',
                value: 'OG_GEODECIMAL'
            }, {
                key: 'Profile',
                value: 'truckfast'
            }]
        },
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


    var options = {
        url: 'https://xroute-eu-n-test.cloud.ptvgroup.com/xroute/rs/XRoute/calculateRoute',
        headers: {
            'Authorization': 'Basic ' + btoa ('xtok:' + 204109275126088),
            'Content-Type': 'application/json'
        },
        json: true,
        body: peticion
    };

    res.json({ "prueba": "correcto" });
/*
    request.post (options, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log ("EXITO");
            //console.log(response);
            res.json(body);

        }
        else {
            console.log ("ERROR");
            console.log(error);
            console.log (response.statusCode);
            console.log (body);
            }
    });
*/



/*    var article = new Article(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
    */
};
