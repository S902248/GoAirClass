const mongoose = require('mongoose');
const FlightBooking = require('./backend/models/flight/flightBooking.model');
const Flight = require('./backend/models/flight/flight.model');
require('dotenv').config({ path: './backend/.env' });

async function verifyPNR() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find a flight to use
        const flight = await Flight.findOne();
        if (!flight) {
            console.error('No flight found in DB. Please create one first.');
            process.exit(1);
        }

        const testBooking = new FlightBooking({
            flightId: flight._id,
            flightDetails: {
                departureTime: new Date(),
                durationMinutes: 120
            },
            passengers: [{
                firstName: 'Test',
                lastName: 'User',
                gender: 'Male',
                dateOfBirth: new Date('1990-01-01'),
                seatNumber: '1A'
            }],
            contactDetails: {
                email: 'test@example.com',
                phone: '+919876543210'
            },
            fareDetails: {
                baseFare: 1000
            }
        });

        // Trigger pre-validate hook
        await testBooking.validate();
        
        console.log('--- Verification Result ---');
        console.log('PNR:', testBooking.pnr);
        console.log('Ticket Number:', testBooking.ticketNumber);
        console.log('Booking ID:', testBooking.bookingId);
        
        if (testBooking.pnr && testBooking.ticketNumber) {
            console.log('SUCCESS: PNR and Ticket Number generated!');
        } else {
            console.log('FAILURE: Missing identifiers.');
        }

    } catch (err) {
        console.error('Error during verification:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyPNR();
