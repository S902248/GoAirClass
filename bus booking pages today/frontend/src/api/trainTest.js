/**
 * Train API Test Script (Reference)
 * This file demonstrates how to use the trainApi in components.
 */
import trainApi from './trainApi';

export const testTrainModule = async () => {
    console.log('--- Testing Train Module API ---');
    try {
        // Fetch All Trains
        const trains = await trainApi.getAllTrains();
        console.log('Trains fetched:', trains.trains.length);

        // Fetch Dashboard Stats
        const stats = await trainApi.getDashboardStats();
        console.log('Admin Stats:', stats.stats);

        // Fetch Bookings
        const bookings = await trainApi.getAllBookings();
        console.log('Bookings found:', bookings.bookings.length);

        // PNR Query Example
        // const pnrData = await trainApi.getBookingByPNR('1234567890');
        
    } catch (error) {
        console.error('Train API Test Failed:', error);
    }
};
