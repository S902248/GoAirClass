const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const Train = require('./backend/models/train/Train');
const TrainBooking = require('./backend/models/train/TrainBooking');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const trainCount = await Train.countDocuments();
        const bookingCount = await TrainBooking.countDocuments();
        
        console.log(`Total Trains: ${trainCount}`);
        console.log(`Total Bookings: ${bookingCount}`);

        const revenueData = await TrainBooking.aggregate([
            { $group: { _id: null, total: { $sum: '$totalFare' } } }
        ]);
        console.log(`Total Revenue: ${revenueData[0]?.total || 0}`);

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

check();
