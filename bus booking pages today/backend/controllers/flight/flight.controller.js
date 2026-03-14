const Flight = require('../../models/flight/flight.model');
const Airport = require('../../models/flight/airport.model');

const searchFlights = async (req, res) => {
    try {
        const { from, to, date } = req.query;

        // 1. Find Airports
        const fromAirportDoc = await Airport.findOne({ airportCode: from?.toUpperCase() });
        const toAirportDoc = await Airport.findOne({ airportCode: to?.toUpperCase() });

        if (!fromAirportDoc || !toAirportDoc) {
            return res.json({ success: true, flights: [] });
        }

        // 2. Build Date Query
        const query = {
            fromAirport: fromAirportDoc._id,
            toAirport: toAirportDoc._id,
            status: { $ne: 'Cancelled' }
        };

        if (date) {
            const searchDate = new Date(date);
            // Check if date is valid
            if (!isNaN(searchDate.getTime())) {
                const nextDate = new Date(searchDate);
                nextDate.setDate(searchDate.getDate() + 1);

                query.departureTime = {
                    $gte: searchDate,
                    $lt: nextDate
                };
            }
        }

        // 3. Find flights and populate
        const flightsData = await Flight.find(query)
            .populate('airlineId')
            .populate('fromAirport')
            .populate('toAirport')
            .sort({ price: 1 });

        // 4. Format for frontend
        const formattedFlights = flightsData.map(f => {
            const formatTime = (d) => {
                if (!d) return '--:--';
                const dateObj = new Date(d);
                if (isNaN(dateObj.getTime())) return '--:--';
                let hours = dateObj.getHours();
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
            };

            return {
                _id: f._id,
                flightNumber: f.flightNumber || 'Unknown',
                airline: f.airlineId?.airlineName || 'Unknown Airline',
                logo: f.airlineId?.logo || '',
                from: f.fromAirport?.airportCode || from?.toUpperCase(),
                to: f.toAirport?.airportCode || to?.toUpperCase(),
                departureTime: formatTime(f.departureTime),
                arrivalTime: formatTime(f.arrivalTime),
                duration: f.duration || '0h 0m',
                stops: 'Non-Stop', // Add field to schema if dynamic stops are needed
                price: f.price || 0,
                type: 'Economy' // or dynamic based on classes
            };
        });

        res.json({ success: true, flights: formattedFlights });
    } catch (err) {
        console.error("Flight Search Error:", err);
        res.status(500).json({ success: false, error: err.message, flights: [] });
    }
};

const createFlight = async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json({ success: true, flight });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getFlights = async (req, res) => {
    try {
        const flights = await Flight.find()
            .populate('airlineId')
            .populate('fromAirport')
            .populate('toAirport')
            .sort({ createdAt: -1 });
        res.json({ success: true, flights });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id)
            .populate('airlineId')
            .populate('fromAirport')
            .populate('toAirport');
        if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
        res.json({ success: true, flight });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
        res.json({ success: true, flight });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteFlight = async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Flight deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { createFlight, searchFlights, getFlights, getFlightById, updateFlight, deleteFlight };
