const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Bus = require('../models/Bus');
const { operatorAuthMiddleware } = require('../middleware/operatorAuthMiddleware');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create Bus with Images
router.post('/create', operatorAuthMiddleware, upload.array('images', 6), async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Parse JSON fields if sent as FormData
        const busData = {
            ...req.body,
            images: imagePaths,
            operator: req.operator.id
        };

        // Convert types if necessary (FormData sends everything as strings)
        if (typeof busData.totalSeats === 'string') {
            busData.totalSeats = parseInt(busData.totalSeats);
        }
        if (typeof busData.amenities === 'string') {
            try {
                busData.amenities = JSON.parse(busData.amenities);
            } catch (e) {
                busData.amenities = busData.amenities.split(',').map(a => a.trim());
            }
        }
        if (typeof busData.seatLayout === 'string') {
            try {
                busData.seatLayout = JSON.parse(busData.seatLayout);
            } catch (e) {
                busData.seatLayout = [];
            }
        }

        const bus = new Bus(busData);
        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get by Operator (Current logged-in operator)
router.get('/my-buses', operatorAuthMiddleware, async (req, res) => {
    try {
        const buses = await Bus.find({ operator: req.operator.id });
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All (For Admin) — scoped by adminId for 'admin' role, all for 'superadmin'
router.get('/all', async (req, res) => {
    try {
        // Try to get auth token if present (optional auth)
        const token = req.header('Authorization')?.replace('Bearer ', '');
        let userRole = 'superadmin'; // default: no token = superadmin scope (backward compat)
        let userId = null;

        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
                userRole = decoded.role;
                userId = decoded.id;
            } catch (_) { }
        }

        if (userRole === 'admin' && userId) {
            // Step 1: get operator IDs for this admin
            const Operator = require('../models/Operator');
            const mongoose = require('mongoose');
            const adminObjId = new mongoose.Types.ObjectId(userId);
            const operators = await Operator.find({ adminId: adminObjId }, '_id');
            const operatorIds = operators.map(op => op._id);

            // Step 2: get buses belonging to those operators
            const buses = await Bus.find({ operator: { $in: operatorIds } }).populate('operator');
            return res.json(buses);
        }

        // superadmin or unauthenticated: return all
        const buses = await Bus.find().populate('operator');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        // Ensure the bus belongs to the logged-in operator
        const bus = await Bus.findOneAndUpdate(
            { _id: req.params.id, operator: req.operator.id },
            req.body,
            { new: true }
        );
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found or unauthorized' });
        }
        res.json(bus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        // Ensure the bus belongs to the logged-in operator
        const bus = await Bus.findOneAndDelete({ _id: req.params.id, operator: req.operator.id });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found or unauthorized' });
        }
        res.json({ message: 'Bus deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
