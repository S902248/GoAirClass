import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import userReducer from './slices/userSlice';
import bookingReducer from './slices/bookingSlice';
import hotelReducer from './slices/hotelSlice';
import hotelBookingReducer from './slices/hotelBookingSlice';
import hotelOfferReducer from './slices/hotelOfferSlice';

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        users: userReducer,
        bookings: bookingReducer,
        hotels: hotelReducer,
        hotelBookings: hotelBookingReducer,
        hotelOffers: hotelOfferReducer,
    },
});

