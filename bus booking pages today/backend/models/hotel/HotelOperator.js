const mongoose = require('mongoose');

const HotelOperatorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    companyName: { type: String, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['hotel_operator', 'hotel_manager'], default: 'hotel_operator' },
    permissions: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('HotelOperator', HotelOperatorSchema);
