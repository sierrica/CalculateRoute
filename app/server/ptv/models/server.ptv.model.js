var mongoose = require ('mongoose');

/* Schema */
var PtvSchema = new mongoose.Schema ({

    _id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: {
        vehicletype: {type: String, default: 'default' },

        height: { type: Number, default: 148 },
        width: { type: Number, default: 179 },
        lengt: { type: Number, default: 420 },

        emptyweight: { type: Number, default: 1220 },
        totalweight: { type: Number, default: 1750 },
        trailerweight: { type: Number, default: 0 },

        loadtype: { type: String, default: 'PASSENGER' },
        hazardousgoodtype: { type: String, default: 'NONE' },
        loadweight: { type: Number, default: 1750 },
        maximumpassengers: { type: Number, default: 5 },

        axleload: { type: Number, default: 920 },
        axlenumber: { type: Number, default: 2 },

        cylinder: { type: Number, default: 1600 },
        fueltype: {type: String, default: 'EUROSUPER' },
        fuelconsumption: { type: Number, default: 4.5 },
        emmissionclass: { type: String, default: 'EURO_5'},

        yearmanufacturer: {type: Number, default: 2005 },
        delivery: {type: Boolean, default: false }
    },
    trayect: {
        optimization: { type: Number, default: 0 },
        dinamic_route: { type: Boolean, default: false },

        motorway: { type: Number, default: 0 },
        highway: { type: Number, default: 0 },
        national: { type: Number, default: 0 },
        regional: { type: Number, default: 0 },
        county: { type: Number, default: 0 },
        urban: { type: Number, default: 0 },
        residential: { type: Number, default: 0 },

        tollroad: { type: Number, default: 0 },
        ramp: { type: Number, default: 0 },
        ferry: { type: Number, default: 0 }

    },
    details: {
        manoeuvres: { type: Boolean, default: true }
    }
});


module.exports = mongoose.model ('Ptv', PtvSchema);