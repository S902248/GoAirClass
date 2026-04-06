import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

// Dashboard
import AdminPanel from '../pages/dashboard/AdminPanel';

// Admins
import AddAdminView from '../pages/admins/AddAdminView';
import AdminDetailsView from '../pages/admins/AdminDetailsView';
import AdminRequests from '../pages/AdminRequests';
import CreateNewAdmin from '../pages/admins/CreateNewAdmin';


// Users
import ActiveUsers from '../pages/users/ActiveUsers';
import DeactiveUsers from '../pages/users/DeactiveUsers';
import UserDepositReportView from '../pages/users/UserDepositReportView';
import UserTransactionHistory from '../pages/users/UserTransactionHistory';
import UserWithdrawReportView from '../pages/users/UserWithdrawReportView';

// Reports
import ReportsView from '../pages/reports/ReportsView';
import BookReportView from '../pages/reports/BookReportView';
import FailedReportView from '../pages/reports/FailedReportView';
import CancelReportView from '../pages/reports/CancelReportView';

// Finance
import WithdrawAmount from '../pages/finance/WithdrawAmount';
import PaymentsSettingsView from '../pages/finance/PaymentsSettingsView';
import CommissionManagement from '../pages/finance/CommissionManagement';
import PricingSimulation from '../pages/finance/PricingSimulation';

// Marketing
import AdvertisementView from '../pages/marketing/AdvertisementView';
import BannerManagementView from '../pages/marketing/BannerManagementView';
import CouponsView from '../pages/marketing/CouponsView';

// Common
import ContactView from '../pages/common/ContactView';
import FooterPageView from '../pages/common/FooterPageView';

// Hotels
import AllHotels from '../pages/hotels/AllHotels';
import PendingHotels from '../pages/hotels/PendingHotels';
import ApprovedHotels from '../pages/hotels/ApprovedHotels';
import RejectedHotels from '../pages/hotels/RejectedHotels';
import HotelRooms from '../pages/hotels/HotelRooms';
import HotelBookings from '../pages/hotels/HotelBookings';
import HotelOffers from '../pages/hotels/HotelOffers';

// Flights
import Airports from '../pages/flights/Airports';
import Airlines from '../pages/flights/Airlines';
import AllFlights from '../pages/flights/AllFlights';
import FlightBookings from '../pages/flights/FlightBookings';
import FlightOffers from '../pages/flights/FlightOffers';
import FlightSettings from '../pages/flights/FlightSettings';

// Train
import TrainDashboard from '../pages/train/TrainDashboard';
import AllTrains from '../pages/train/AllTrains';
import AddTrain from '../pages/train/AddTrain';
import TrainRoutesSchedule from '../pages/train/TrainRoutes';
import Stations from '../pages/train/Stations';
import SeatCoachSetup from '../pages/train/SeatCoachSetup';
import FareManagement from '../pages/train/FareManagement';
import TrainBookings from '../pages/train/TrainBookings';
import PNRManagement from '../pages/train/PNRManagement';
import TrainReports from '../pages/train/TrainReports';
import TrainAPISettings from '../pages/train/TrainAPISettings';
import QuotaManagement from '../pages/train/QuotaManagement';



const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                {/* Dashboard */}
                <Route path="" element={<AdminPanel />} />

                {/* Admins */}
                <Route path="admins/add" element={<AddAdminView />} />
                <Route path="admins/requests" element={<AdminRequests />} />
                <Route path="admins/create-from-request/:id" element={<CreateNewAdmin />} />
                <Route path="admins/details" element={<AdminDetailsView />} />


                {/* Users */}
                <Route path="users/active" element={<ActiveUsers />} />
                <Route path="users/deactive" element={<DeactiveUsers />} />
                <Route path="users/deposit-report" element={<UserDepositReportView />} />
                <Route path="users/withdraw-report" element={<UserWithdrawReportView />} />
                <Route path="users/transactions" element={<UserTransactionHistory />} />

                {/* Reports */}
                <Route path="reports/main" element={<ReportsView />} />
                <Route path="reports/bookings" element={<BookReportView />} />
                <Route path="reports/cancelled" element={<CancelReportView />} />
                <Route path="reports/failed" element={<FailedReportView />} />

                {/* Finance */}
                <Route path="finance/withdraw" element={<WithdrawAmount />} />
                <Route path="finance/settings" element={<PaymentsSettingsView />} />
                <Route path="finance/commission" element={<CommissionManagement />} />
                <Route path="finance/pricing-simulation" element={<PricingSimulation />} />

                {/* Marketing */}
                <Route path="marketing/ads" element={<AdvertisementView />} />
                <Route path="marketing/banners" element={<BannerManagementView />} />
                <Route path="marketing/coupons" element={<CouponsView />} />

                {/* Common */}
                <Route path="common/contact" element={<ContactView />} />
                <Route path="common/footer" element={<FooterPageView />} />

                {/* Hotels */}
                <Route path="hotels/all" element={<AllHotels />} />
                <Route path="hotels/pending" element={<PendingHotels />} />
                <Route path="hotels/approved" element={<ApprovedHotels />} />
                <Route path="hotels/rejected" element={<RejectedHotels />} />
                <Route path="hotels/rooms" element={<HotelRooms />} />
                <Route path="hotels/bookings" element={<HotelBookings />} />
                <Route path="hotels/offers" element={<HotelOffers />} />

                {/* Flights */}
                <Route path="flights/airports" element={<Airports />} />
                <Route path="flights/airlines" element={<Airlines />} />
                <Route path="flights/all" element={<AllFlights />} />
                <Route path="flights/bookings" element={<FlightBookings />} />
                <Route path="flights/offers" element={<FlightOffers />} />
                <Route path="flights/settings" element={<FlightSettings />} />

                {/* Train */}
                <Route path="train/dashboard" element={<TrainDashboard />} />
                <Route path="train/all" element={<AllTrains />} />
                <Route path="train/add" element={<AddTrain />} />
                <Route path="train/routes" element={<TrainRoutesSchedule />} />
                <Route path="train/stations" element={<Stations />} />
                <Route path="train/seat-coach" element={<SeatCoachSetup />} />
                <Route path="train/fare" element={<FareManagement />} />
                <Route path="train/bookings" element={<TrainBookings />} />
                <Route path="train/pnr" element={<PNRManagement />} />
                <Route path="train/api-settings" element={<TrainAPISettings />} />
                <Route path="train/quota" element={<QuotaManagement />} />
                <Route path="train/reports" element={<TrainReports />} />



                {/* Placeholder for Settings (from sidebar) */}
                <Route path="settings" element={<div className="p-6">Settings Page</div>} />

                {/* Fallback to admin root */}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
