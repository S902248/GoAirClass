const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number },
    maxDiscountAmount: { type: Number },
    minBookingAmount: { type: Number, default: 0 },
    applicableRoutes: { type: String, default: 'all' },
    applicableBuses: { type: String, default: 'all' },
    totalUsageLimit: { type: Number },
    perUserLimit: { type: Number },
    validFrom: { type: Date },
    validTill: { type: Date },

    // Legacy fields for backward compatibility
    discountAmount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },

    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Operator', required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Expired'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
