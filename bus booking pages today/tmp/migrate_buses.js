require('dotenv').config({ path: 'c:\\Users\\Admin\\Desktop\\collab\\GoAirClass\\bus booking pages today\\backend\\.env' });
const mongoose = require('mongoose');
const Bus = require('../models/Bus');

async function migrateBuses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all buses with missing status field to 'active'
        const result = await Bus.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'active' } }
        );

        console.log('Migration Result:', result);
        mongoose.connection.close();
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

migrateBuses();
