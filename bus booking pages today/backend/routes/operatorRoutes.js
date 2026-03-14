const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');
const jwt = require('jsonwebtoken');
const { operatorAuthMiddleware } = require('../middleware/operatorAuthMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Create Operator — adminId must be sent from the frontend
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const operatorData = {
            ...req.body,
            // Attach the creating admin's ID for data isolation
            adminId: req.user.id
        };
        const operator = new Operator(operatorData);
        await operator.save();
        res.status(201).json(operator);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Operator Login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email?.trim();
        password = password?.trim();

        console.log(`[LOGIN ATTEMPT] Email: ${email}`);

        // Case-insensitive search
        const operator = await Operator.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!operator) {
            console.log(`[LOGIN FAILED] No operator found with email: ${email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await operator.comparePassword(password);
        console.log(`[LOGIN DEBUG] Password match result: ${isMatch}`);

        if (!isMatch) {
            console.log(`[LOGIN FAILED] Password verification failed for: ${email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: operator._id, role: 'operator' },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log(`[LOGIN SUCCESS] Operator logged in: ${email}`);
        res.json({ token, operator });
    } catch (err) {
        console.error(`[LOGIN ERROR] ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Protected Operator Routes
// Public/Admin route to get operators with bus counts
// - superadmin: sees ALL operators
// - admin: sees only operators linked to their adminId
router.get('/all', authMiddleware, async (req, res) => {
    try {
        // Build match filter based on role
        const matchFilter = {};
        if (req.user.role === 'admin') {
            matchFilter.adminId = require('mongoose').Types.ObjectId.createFromHexString
                ? require('mongoose').Types.ObjectId.createFromHexString(req.user.id.toString())
                : new (require('mongoose').Types.ObjectId)(req.user.id);
        }
        // superadmin: no filter, matchFilter stays {}

        const operators = await require('../models/Operator').aggregate([
            { $match: matchFilter },
            {
                $lookup: {
                    from: 'buses',
                    localField: '_id',
                    foreignField: 'operator',
                    as: 'operatorBuses'
                }
            },
            {
                $project: {
                    name: 1,
                    companyName: 1,
                    contactNumber: 1,
                    email: 1,
                    address: 1,
                    status: 1,
                    adminId: 1,
                    totalBuses: { $size: '$operatorBuses' }
                }
            }
        ]);
        res.json(operators);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        const operator = await Operator.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(operator);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await Operator.findByIdAndDelete(req.params.id);
        res.json({ message: 'Operator deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Profile
router.get('/profile', operatorAuthMiddleware, async (req, res) => {
    try {
        const operator = await Operator.findById(req.operator.id).select('-password');
        if (!operator) {
            return res.status(404).json({ error: 'Operator not found' });
        }
        res.json(operator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
// Delete
router.delete('/:id', async (req, res) => {
    try {
        await Operator.findByIdAndDelete(req.params.id);
        res.json({ message: 'Operator deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Profile
router.get('/profile', operatorAuthMiddleware, async (req, res) => {
    try {
        const operator = await Operator.findById(req.operator.id).select('-password');
        if (!operator) {
            return res.status(404).json({ error: 'Operator not found' });
        }
        res.json(operator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
