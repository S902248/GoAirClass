const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const couponRoutes = require("./routes/couponRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cityRoutes = require("./routes/cityRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Hotel module routes
const hotelRoutes = require('./routes/hotel/hotelRoutes');
const roomRoutes = require('./routes/hotel/roomRoutes');
const hotelBookingRoutes = require('./routes/hotel/bookingRoutes');
const offerRoutes = require('./routes/hotel/offerRoutes');
const hotelOperatorRoutes = require('./routes/hotel/hotelOperatorRoutes');
const hotelCouponRoutes = require('./routes/hotel/hotelCouponRoutes');


// Hotel Operator Panel routes
const hotelOperatorAuthRoutes = require('./routes/hotel/hotelOperatorAuthRoutes');
const operatorHotelRoutes = require('./routes/hotel/operatorHotelRoutes');
const operatorRoomRoutes = require('./routes/hotel/operatorRoomRoutes');
const operatorBookingRoutes = require('./routes/hotel/operatorBookingRoutes');

// Flight module routes
const airportRoutes = require('./routes/flight/airport.routes');
const airlineRoutes = require('./routes/flight/airline.routes');
const flightRoutes = require('./routes/flight/flight.routes');
const flightBookingRoutes = require('./routes/flight/booking.routes');
const flightOfferRoutes = require('./routes/flight/offer.routes');
const flightSettingsRoutes = require('./routes/flight/settings.routes');
const flightDashboardRoutes = require('./routes/flight/dashboard.routes');
const passengerRoutes = require('./routes/flight/passenger.routes');
const flightSeatRoutes = require('./routes/flight/seat.routes');
const flightPaymentRoutes = require('./routes/flight/payment.routes');
const flightTicketRoutes = require('./routes/flight/ticket.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logger - MUST be above routes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length) {
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
    }
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Hotel module
app.use('/api/hotels', hotelRoutes);
app.use('/api/hotel-rooms', roomRoutes);
app.use('/api/hotel-bookings', hotelBookingRoutes);
app.use('/api/hotel-offers', offerRoutes);
app.use('/api/hotel-operators', hotelOperatorRoutes);
app.use('/api/hotel-coupons', hotelCouponRoutes);


// Hotel Operator Panel
app.use('/api/hotel-operator/auth', hotelOperatorAuthRoutes);
app.use('/api/hotel-operator/hotels', operatorHotelRoutes);
app.use('/api/hotel-operator/rooms', operatorRoomRoutes);
app.use('/api/hotel-operator/bookings', operatorBookingRoutes);

// Flight module
app.use('/api/airports', airportRoutes);
app.use('/api/airlines', airlineRoutes);
app.use('/api/flights/dashboard', flightDashboardRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/flight-bookings', flightBookingRoutes);
app.use('/api/flight-offers', flightOfferRoutes);
app.use('/api/flight-settings', flightSettingsRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/seats', flightSeatRoutes);
app.use('/api/flight-payments', flightPaymentRoutes);
app.use('/api/tickets', flightTicketRoutes);

app.get("/", (req, res) => {
    res.send("API Working...");
});

module.exports = app;