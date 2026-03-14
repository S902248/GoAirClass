import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import BookingManagement from './pages/BookingManagement';
import AdminManagement from './pages/AdminManagement';
import BusManagement from './pages/BusManagement';
import Reports from './pages/Reports';
import OperatorsManagement from './pages/OperatorsManagement';
import OperatorBuses from './pages/OperatorBuses';

// ── Hotel imports ──────────────────────────────────────────────────────────────
import AllHotels from './pages/hotels/AllHotels';
import PendingHotels from './pages/hotels/PendingHotels';
import ApprovedHotels from './pages/hotels/ApprovedHotels';
import RejectedHotels from './pages/hotels/RejectedHotels';
import HotelRooms from './pages/hotels/HotelRooms';
import HotelBookings from './pages/hotels/HotelBookings';
import HotelOffers from './pages/hotels/HotelOffers';
import AddHotelOperator from './pages/hotels/AddHotelOperator';
import HotelOperators from './pages/hotels/HotelOperators';

// ── Flight imports ─────────────────────────────────────────────────────────────
import FlightsDashboard from './pages/flights/FlightsDashboard';
import AllFlights from './pages/flights/AllFlights';
import AddFlight from './pages/flights/AddFlight';
import FlightBookings from './pages/flights/FlightBookings';
import Passengers from './pages/flights/Passengers';

const AdmineApp = ({ user, onLogout }) => {
    return (
        <Layout user={user} onLogout={onLogout}>
            <Routes>
                {/* ── Core routes ── */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/operators" element={<OperatorsManagement />} />
                <Route path="/operators/:operatorId/buses" element={<OperatorBuses />} />
                <Route path="/routes" element={<BusManagement initialTab="routes" />} />
                <Route path="/bus-management" element={<BusManagement initialTab="buses" />} />
                <Route path="/schedules" element={<BusManagement initialTab="schedules" />} />
                <Route path="/bookings" element={<BookingManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/admins" element={<AdminManagement />} />
                <Route path="/settings" element={<div className="p-10 text-2xl font-black uppercase tracking-tighter">Settings Page</div>} />

                {/* ── Flight routes ── */}
                <Route path="/flights/dashboard" element={<FlightsDashboard />} />
                <Route path="/flights/all" element={<AllFlights />} />
                <Route path="/flights/add" element={<AddFlight />} />
                <Route path="/flights/bookings" element={<FlightBookings />} />
                <Route path="/flights/passengers" element={<Passengers />} />

                {/* ── Hotel routes ── */}
                <Route path="/hotels" element={<AllHotels />} />
                <Route path="/hotels/pending" element={<PendingHotels />} />
                <Route path="/hotels/approved" element={<ApprovedHotels />} />
                <Route path="/hotels/rejected" element={<RejectedHotels />} />
                <Route path="/hotels/rooms" element={<HotelRooms />} />
                <Route path="/hotels/bookings" element={<HotelBookings />} />
                <Route path="/hotels/offers" element={<HotelOffers />} />
                <Route path="/hotels/operators" element={<HotelOperators />} />
                <Route path="/hotels/operators/add" element={<AddHotelOperator />} />
            </Routes>
        </Layout>
    );
};

export default AdmineApp;
