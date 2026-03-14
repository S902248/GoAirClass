const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Import model
const FlightBooking = require('../backend/models/flight/flightBooking.model');
const Flight = require('../backend/models/flight/flight.model');

async function verifyPNR() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const flight = await Flight.findOne();
        if (!flight) {
            console.error('No flight found');
            process.exit(1);
        }

        const booking = new FlightBooking({
            flightId: flight._id,
            flightDetails: {
                departureTime: new Date(),
                durationMinutes: 60
            },
            passengers: [{
                firstName: 'Backend',
                lastName: 'PNR',
                gender: 'Male',
                dateOfBirth: new Date(),
                seatNumber: '1A'
            }],
            contactDetails: {
                email: 'test@backend.com',
                phone: '+919876543210'
            },
            fareDetails: {
                baseFare: 1000
            }
        });

        // Trigger pre-validate
        await booking.validate();
        
        console.log('--- Identifiers ---');
        console.log('PNR:', booking.pnr);
        console.log('Ticket:', booking.ticketNumber);
        
        if (booking.pnr && booking.ticketNumber && booking.pnr.length === 6) {
            console.log('SUCCESS: Backend PNR generation verified.');
        } else {
            console.log('FAILURE: Invalid identifiers.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyPNR();
