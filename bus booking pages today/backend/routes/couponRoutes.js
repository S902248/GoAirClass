const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

const { operatorAuthMiddleware } = require('../middleware/operatorAuthMiddleware');

// Create Coupon
router.post('/create', operatorAuthMiddleware, async (req, res) => {
    try {
        const coupon = new Coupon({
            ...req.body,
            operatorId: req.operator.id
        });
        await coupon.save();
        res.status(201).json(coupon);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get My Coupons
router.get('/my-coupons', operatorAuthMiddleware, async (req, res) => {
    try {
        const coupons = await Coupon.find({ operatorId: req.operator.id });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        const coupon = await Coupon.findOneAndUpdate(
            { _id: req.params.id, operatorId: req.operator.id },
            req.body,
            { new: true }
        );
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found or unauthorized' });
        }
        res.json(coupon);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        const coupon = await Coupon.findOneAndDelete({ _id: req.params.id, operatorId: req.operator.id });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found or unauthorized' });
        }
        res.json({ message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Get Active Coupons
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let activeCoupons = await Coupon.find({ status: 'Active' });

        // Filter by Date
        activeCoupons = activeCoupons.filter(coupon => {
            if (coupon.validFrom && today < new Date(new Date(coupon.validFrom).setHours(0, 0, 0, 0))) {
                return false;
            }
            if (coupon.validTill) {
                const validTillDate = new Date(coupon.validTill);
                validTillDate.setHours(23, 59, 59, 999);
                if (now > validTillDate) return false;
            }
            if (coupon.expiryDate) {
                const expiryDate = new Date(coupon.expiryDate);
                expiryDate.setHours(23, 59, 59, 999);
                if (now > expiryDate) return false;
            }
            return true;
        });

        // Filter by Usage Limit
        const Booking = require('../models/Booking');
        const validCoupons = [];

        for (const coupon of activeCoupons) {
            if (coupon.totalUsageLimit !== undefined && coupon.totalUsageLimit > 0) {
                const usageCount = await Booking.countDocuments({
                    couponCode: new RegExp(`^${coupon.code}$`, 'i'),
                    paymentStatus: 'Completed'
                });
                if (usageCount < coupon.totalUsageLimit) {
                    validCoupons.push(coupon);
                }
            } else {
                validCoupons.push(coupon);
            }
        }

        res.json(validCoupons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Validate a coupon code for passengers
router.post('/validate', async (req, res) => {
    try {
        const { code, totalAmount } = req.body;
        if (!code) return res.status(200).json({ valid: false, message: 'Coupon code required' });

        const coupon = await Coupon.findOne({
            code: new RegExp(`^${code}$`, 'i'),
            status: 'Active'
        });
        if (!coupon) return res.status(200).json({ valid: false, message: 'Invalid or expired coupon' });

        // Check date validity if available
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (coupon.validFrom && today < new Date(coupon.validFrom.setHours(0, 0, 0, 0))) {
            return res.status(200).json({ valid: false, message: 'Coupon is not yet active' });
        }

        // Expiration check: if validTill or expiryDate exists, coupon is expired if today > expiry date
        if (coupon.validTill) {
            const validTillDate = new Date(coupon.validTill);
            validTillDate.setHours(23, 59, 59, 999); // Expire at the END of the day
            if (now > validTillDate) {
                return res.status(200).json({ valid: false, message: 'Coupon has expired' });
            }
        }

        if (coupon.expiryDate) {
            const expiryDate = new Date(coupon.expiryDate);
            expiryDate.setHours(23, 59, 59, 999); // Expire at the END of the day
            if (now > expiryDate) {
                return res.status(200).json({ valid: false, message: 'Coupon has expired' });
            }
        }

        // Check Minimum Booking Amount
        if (coupon.minBookingAmount && totalAmount < coupon.minBookingAmount) {
            return res.status(200).json({ valid: false, message: `Minimum booking amount of ₹${coupon.minBookingAmount} required` });
        }

        // Check usage limits by counting actual completed bookings
        if (coupon.totalUsageLimit !== undefined && coupon.totalUsageLimit > 0) {
            const Booking = require('../models/Booking');
            const usageCount = await Booking.countDocuments({
                couponCode: new RegExp(`^${code}$`, 'i'),
                paymentStatus: 'Completed'
            });
            if (usageCount >= coupon.totalUsageLimit) {
                return res.status(200).json({ valid: false, message: 'Coupon usage limit reached' });
            }
        }

        // Calculate final discount
        let discount = 0;
        if (coupon.discountType === 'flat') {
            discount = coupon.discountValue || coupon.discountAmount;
        } else {
            // Percentage
            const discountPercent = coupon.discountValue || coupon.discountAmount;
            discount = (totalAmount * discountPercent) / 100;

            // Apply max cap if it exists
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
            }
        }

        // Ensure we don't discount more than the total amount
        discount = Math.min(discount, totalAmount);

        res.json({
            valid: true,
            discount: Math.round(discount),
            message: 'Coupon applied successfully'
        });
    } catch (err) {
        res.status(500).json({ valid: false, error: err.message });
    }
});

module.exports = router;
