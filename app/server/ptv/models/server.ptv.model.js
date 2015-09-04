var mongoose = require ('mongoose');

/* Schema */
var PtvSchema = new mongoose.Schema ({

    _id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: {
        height: { type: Number, default: 200 },
        width: { type: Number, default: 200 },
        length: { type: Number, default: 200 },
        weight: { type: Number, default: 1200 },
        fueltype: {type: String, default: 'EUROSUPER' },
        fuelconsumption: { type: Number, default: 5 }
    },
    trayect: {
        optimization: { type: Number, default: 0 },
        dinamic_route: { type: Boolean, default: false },

        motorway: { type: Number, default: 0 },
        highway: { type: Number, default: 0 },
        national: { type: Number, default: 0 },
        provincial: { type: Number, default: 0 },
        county: { type: Number, default: 0 },
        residential: { type: Number, default: 0 },
        urban: { type: Number, default: 0 },

        tollroad: { type: Number, default: 0 },
        ramps: { type: Number, default: 0 },
        ferry: { type: Number, default: 0 }

    },
    details: {
        manoeuvres: { type: Boolean, default: true }
    }
});


module.exports = mongoose.model ('Ptv', PtvSchema);