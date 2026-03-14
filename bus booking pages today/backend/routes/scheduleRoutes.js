const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

const { operatorAuthMiddleware } = require('../middleware/operatorAuthMiddleware');
const Bus = require('../models/Bus');

// Create Schedule
router.post('/create', operatorAuthMiddleware, async (req, res) => {
    try {
        // Verify the bus belongs to the operator
        const bus = await Bus.findOne({ _id: req.body.bus, operator: req.operator.id });
        if (!bus) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this bus' });
        }

        const payload = {
            ...req.body,
            operator: req.operator.id
        };

        const schedule = new Schedule(payload);
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Update
router.put('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule || schedule.operator.toString() !== req.operator.id) {
            return res.status(404).json({ error: 'Schedule not found or unauthorized' });
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Delete
router.delete('/:id', operatorAuthMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule || schedule.operator.toString() !== req.operator.id) {
            return res.status(404).json({ error: 'Schedule not found or unauthorized' });
        }

        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get All (Filtered for Operator)
router.get('/my-schedules', operatorAuthMiddleware, async (req, res) => {
    try {
        const schedules = await Schedule.find({ operator: req.operator.id }).populate('bus route');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All (For Admin)
router.get('/all', async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('bus route operator');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Search Schedules (Public)
router.get('/search', async (req, res) => {
    try {
        const { from, to, date, womenBooking } = req.query;

        if (!from || !to) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        // 1. Find the route
        const Route = require('../models/Route');
        const route = await Route.findOne({
            fromCity: { $regex: new RegExp(from, 'i') },
            toCity: { $regex: new RegExp(to, 'i') }
        });

        if (!route) {
            return res.json([]); // No route exists
        }

        // 2. Build schedule query
        let query = { route: route._id };

        let searchDate;
        if (date) {
            const parts = date.split('-');
            if (parts.length === 3) {
                searchDate = new Date(parts[2], parseInt(parts[1]) - 1, parts[0]);
            } else {
                searchDate = new Date(date);
            }
        }

        if (searchDate && !isNaN(searchDate.getTime())) {
            // Trips are generated dynamically: 
            // searchDate must be >= startDate AND frequency must match (currently only daily supported)
            const endOfDay = new Date(searchDate);
            endOfDay.setHours(23, 59, 59, 999);

            query.startDate = { $lte: endOfDay };
            query.frequency = 'daily';
        }

        const schedules = await Schedule.find(query).populate('bus route operator');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
