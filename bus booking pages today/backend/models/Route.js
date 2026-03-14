const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    distance: { type: String, required: true },
    travelTime: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
