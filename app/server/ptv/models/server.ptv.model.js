var mongoose = require ('mongoose');

/* Schema */
var PtvSchema = new mongoose.Schema ({

    _id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: {
        height: { type: Number, default: 200 },
        width: { type: Number, default: 200 }
    },
    trayect: {
        dinamic_route: { type: Boolean, default: false },
        tollroads: { type: Number, default: 0 },
        highways: { type: Number, default: 0 }
    },
    details: {
        manoeuvres: { type: Boolean, default: true }
    }
});


module.exports = mongoose.model ('Ptv', PtvSchema);