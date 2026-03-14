const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Schedule = require('../models/Schedule');
const Booking = require('../models/Booking');

// Generic CRUD helper (Simulated for brevity, can be expanded)
const handleCRUD = (Model) => ({
    getAll: async (req, res) => {
        try {
            const data = await Model.find().populate(Model.modelName === 'Bus' ? 'operator' : Model.modelName === 'Schedule' ? 'bus route' : Model.modelName === 'Booking' ? 'bus route schedule' : '');
            res.json(data);
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    create: async (req, res) => {
        try {
            const newItem = new Model(req.body);
            await newItem.save();
            res.status(201).json(newItem);
        } catch (err) { res.status(400).json({ error: err.message }); }
    }
});

// Operator Routes
router.get('/operators', async (req, res) => {
    try {
        const operators = await Operator.find().lean();
        const operatorsWithBusCount = await Promise.all(operators.map(async (op) => {
            const busCount = await Bus.countDocuments({ operator: op._id });
            return { ...op, totalBuses: busCount };
        }));
        res.json(operatorsWithBusCount);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/operators', async (req, res) => {
    try {
        const newItem = new Operator(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Route Routes
const routeCtrl = handleCRUD(Route);
router.get('/routes', routeCtrl.getAll);
router.post('/routes', routeCtrl.create);

// Bus Routes
const busCtrl = handleCRUD(Bus);
router.get('/buses', busCtrl.getAll);
router.post('/buses', busCtrl.create);

// Schedule Routes
const scheduleCtrl = handleCRUD(Schedule);
router.get('/schedules', scheduleCtrl.getAll);
router.post('/schedules', scheduleCtrl.create);

// Booking Routes
const bookingCtrl = handleCRUD(Booking);
router.get('/bookings', bookingCtrl.getAll);
router.post('/bookings', bookingCtrl.create);

module.exports = router;
