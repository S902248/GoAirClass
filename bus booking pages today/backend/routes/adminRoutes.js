const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { authMiddleware } = require('../middleware/authMiddleware');
const stationController = require('../controllers/stationController');

// ─── Helper: build scoped query filters based on admin role ───────────────────
// superadmin → no filter (sees all)
// admin      → filters by adminId chain: adminId → operatorIds → busIds
const getScopeFilters = async (user) => {
    if (user.role === 'superadmin') {
        return { operatorFilter: {}, busFilter: {}, bookingFilter: {} };
    }

    const adminObjId = new mongoose.Types.ObjectId(user.id);

    const operators = await Operator.find({ adminId: adminObjId }, '_id');
    const operatorIds = operators.map(op => op._id);

    const buses = await Bus.find({ operator: { $in: operatorIds } }, '_id');
    const busIds = buses.map(b => b._id);

    return {
        operatorFilter: { adminId: adminObjId },
        busFilter: { operator: { $in: operatorIds } },
        bookingFilter: { bus: { $in: busIds } },
        operatorIds,
        busIds
    };
};

// GET /api/admin/stats — scoped per admin role; superadmin sees everything
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const User = require('../models/User');
        const FlightBooking = require('../models/flight/flightBooking.model');
        const HotelBooking = require('../models/hotel/HotelBooking');
        
        const { operatorFilter, busFilter, bookingFilter } = await getScopeFilters(req.user);
        const isSuperAdmin = req.user.role === 'superadmin';

        const [totalOperators, totalBuses, totalRoutes, totalUsers] = await Promise.all([
            Operator.countDocuments(operatorFilter),
            Bus.countDocuments(busFilter),
            Route.countDocuments(),
            User.countDocuments({ role: 'user' })
        ]);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Aggregation for all services (Only for SuperAdmin or scoped if applicable)
        // For now, SuperAdmin sees everything, Admin potentially sees a subset of Bus
        
        const [busRevenueRes, flightRevenueRes, hotelRevenueRes, busBookingsCount, flightBookingsCount, hotelBookingsCount] = await Promise.all([
            // Bus Stats
            Booking.aggregate([
                { $match: { ...bookingFilter, paymentStatus: 'Completed' } },
                { $group: { _id: null, total: { $sum: '$totalFare' } } }
            ]),
            // Flight Stats (SuperAdmin only)
            isSuperAdmin ? FlightBooking.aggregate([
                { $match: { paymentStatus: 'PAID' } },
                { $group: { _id: null, total: { $sum: '$fareDetails.totalAmount' } } }
            ]) : Promise.resolve([]),
            // Hotel Stats (SuperAdmin only)
            isSuperAdmin ? HotelBooking.aggregate([
                { $match: { paymentStatus: 'Completed' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]) : Promise.resolve([]),
            // Lifetime Counts
            Booking.countDocuments(bookingFilter),
            isSuperAdmin ? FlightBooking.countDocuments() : Promise.resolve(0),
            isSuperAdmin ? HotelBooking.countDocuments() : Promise.resolve(0)
        ]);

        const totalRevenue = (busRevenueRes[0]?.total || 0) + (flightRevenueRes[0]?.total || 0) + (hotelRevenueRes[0]?.total || 0);
        const totalBookings = busBookingsCount + flightBookingsCount + hotelBookingsCount;

        const topRoutes = await Booking.aggregate([
            { $match: { ...bookingFilter, paymentStatus: 'Completed' } },
            { $group: { _id: '$route', revenue: { $sum: '$totalFare' }, count: { $count: {} } } },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'routes',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'routeDetails'
                }
            },
            { $unwind: { path: '$routeDetails', preserveNullAndEmptyArrays: true } }
        ]);

        const formattedTopRoutes = topRoutes.map(item => ({
            route: item.routeDetails ? `${item.routeDetails.from} → ${item.routeDetails.to}` : 'Unknown Route',
            revenue: `₹${item.revenue.toLocaleString()}`,
            count: `${item.count} Bookings`,
            growth: '+5%'
        }));

        res.json({
            success: true,
            stats: {
                revenue: totalRevenue,
                bookings: totalBookings,
                users: totalUsers,
                totalOperators,
                totalBuses,
                totalRoutes,
                topRoutes: formattedTopRoutes
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/admin/users — global user list (not admin-scoped)
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const User = require('../models/User');
        const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/admin/my-operators — operators scoped to logged-in admin
router.get('/my-operators', authMiddleware, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            const operators = await Operator.find();
            return res.json({ success: true, operators });
        }
        const adminObjId = new mongoose.Types.ObjectId(req.user.id);
        const operators = await Operator.find({ adminId: adminObjId });
        res.json({ success: true, operators });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/admin/my-bookings — bookings scoped to logged-in admin's buses
router.get('/my-bookings', authMiddleware, async (req, res) => {
    try {
        const { bookingFilter } = await getScopeFilters(req.user);
        const bookings = await Booking.find(bookingFilter)
            .populate('bus', 'busName busNumber')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/admin/stations — strict explicitly superadmin protected
router.post('/stations', authMiddleware, async (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ success: false, error: 'Access denied. Super Admin only.' });
    }
    await stationController.addStation(req, res);
});

// GET /api/admin/stations — retrieve all active stations
router.get('/stations', authMiddleware, stationController.getStations);

module.exports = router;
