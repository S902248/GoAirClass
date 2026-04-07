require('dotenv').config({ path: 'c:\\Users\\Admin\\Desktop\\collab\\GoAirClass\\bus booking pages today\\backend\\.env' });
const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Schedule = require('../models/Schedule');
const Booking = require('../models/Booking');
const dayjs = require('dayjs');

async function runDiagnostic() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check Bus Statuses
        const busStats = await Bus.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        console.log('Bus Statuses in DB:', JSON.stringify(busStats, null, 2));

        // Check Schedules for "Running Today"
        const todayEnd = dayjs().endOf('day').toDate();
        // A daily schedule starting on or before today means it's running today.
        const runningTodayCount = await Schedule.countDocuments({ 
            frequency: 'daily', 
            startDate: { $lte: todayEnd } 
        });
        console.log('Daily Schedules starting <= today:', runningTodayCount);

        // Check Bookings
        const bookingCount = await Booking.countDocuments();
        console.log('Total Bookings:', bookingCount);
        
        if (bookingCount > 0) {
            const latestBooking = await Booking.findOne().sort({ createdAt: -1 });
            console.log('Latest Booking Date:', latestBooking.bookingDate);
            console.log('Latest Booking totalFare:', latestBooking.totalFare);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Diagnostic error:', err);
        process.exit(1);
    }
}

runDiagnostic();
