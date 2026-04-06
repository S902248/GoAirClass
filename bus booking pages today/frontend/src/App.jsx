import React, { useMemo } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Offers from './components/Offers'
import WhyChoose from './components/WhyChoose'
import PopularRoutes from './components/PopularRoutes'
import OperatorLogos from './components/OperatorLogos'
import PrimoSection from './components/PrimoSection'

import Footer from './components/Footer'
import CancelTicket from './components/CancelTicket'
import CancelHotel from './components/CancelHotel'
import ChangeTravelDate from './components/ChangeTravelDate'
import FlightHero from './components/FlightHero'
import FlightOffers from './components/FlightOffers'
import PopularFlightRoutes from './components/PopularFlightRoutes'
import AirlinesStrip from './components/AirlinesStrip'
import TrainHero from './components/TrainHero'
import PopularTrainRoutes from './components/PopularTrainRoutes'
import TrainFaresTable from './components/TrainFaresTable'
import TrainResults from './components/TrainResults'
import TrainReview from './components/TrainReview'
import TrainPassengerDetails from './components/TrainPassengerDetails'
import TrainPayment from './components/TrainPayment'
import TrainBooking from './components/TrainBooking'
import TrainSuccess from './components/TrainSuccess'
import HotelHero from './components/HotelHero'
import FeaturedHotels from './components/FeaturedHotels'
import PopularHotelDestinations from './components/PopularHotelDestinations'
import HotelResults from './components/HotelResults'
import HotelDetails from './components/HotelDetails'
import HotelReview from './components/HotelReview'
import HotelGuestDetails from './components/HotelGuestDetails'
import HotelPayment from './components/HotelPayment'
import BusResults from './components/BusResults'
import BusPayment from './components/BusPayment'
import BookingConfirmation from './components/BookingConfirmation'
import PassengerDetails from './components/PassengerDetails'
import BookingSuccess from './components/BookingSuccess'
import AuthModal from './components/AuthModal'
import AccessDenied from './components/AccessDenied'
import ProtectedRoute from './components/ProtectedRoute'
import AdPopup from './components/ads/AdPopup';
import GlobalBanner from './components/GlobalBanner';

import BusTicket from './components/BusTicket';
import TrackTicket from './components/TrackTicket'
import Support from './components/Support'
import LegalPage from './components/LegalPage'
import AboutUs from './components/AboutUs'
import Careers from './components/Careers'
import Blog from './components/Blog'
import Press from './components/Press'
import Contact from './components/Contact'
import RefundPolicy from './components/RefundPolicy'
import CancellationPolicy from './components/CancellationPolicy'
import MyBookings from './components/MyBookings'
import OffersPage from './components/OffersPage'
import FlightResults from './components/FlightResults'
import FlightReview from './components/FlightReview'
import FlightPassengerDetails from './components/FlightPassengerDetails'
import FlightPayment from './components/FlightPayment'
import FlightBookingFlow from './components/FlightBookingFlow'
import FlightBookingConfirmation from './components/FlightBookingConfirmation'
import FlightTicket from './components/FlightTicket'
import FlightCancel from './components/FlightCancel'
import TicketVerification from './components/TicketVerification'
import CancelledBookings from './components/CancelledBookings'

import { Provider } from 'react-redux'
import { store } from './SuperAdminPanel/store.js'
import AdminApp from './SuperAdminPanel/AdminApp.jsx'
import AdmineApp from './admine/AdmineApp.jsx'
import OperatorApp from './operator/OperatorApp.jsx'
import UserProfile from './pages/UserProfile';
import AdminAccessRequest from './pages/AdminAccessRequest';
import AdminLogin from './pages/AdminLogin';
import HotelOperatorApp from './hotelOperator/HotelOperatorApp.jsx';
import HotelBooking from './components/HotelBooking.jsx';
import HotelBookingConfirmation from './components/HotelBookingConfirmation.jsx';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = React.useState(null);
    const [selectedBus, setSelectedBus] = React.useState(null);
    const [selectedSeats, setSelectedSeats] = React.useState([]);
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!localStorage.getItem('token'));
    const [user, setUser] = React.useState(() => {
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState(null);
    const [isSeatOverlayOpen, setIsSeatOverlayOpen] = React.useState(false);
    const [paymentInfo, setPaymentInfo] = React.useState(null);
    const [busBookingData, setBusBookingData] = React.useState(null); // boarding, dropping from overlay
    const [passengers, setPassengers] = React.useState([]);

    // Derived active tab from URL path
    const activeTab = useMemo(() => {
        if (location.pathname.startsWith('/flight')) return 'flight';
        if (location.pathname.startsWith('/train')) return 'train';
        if (location.pathname.startsWith('/hotel')) return 'hotel';
        return 'bus';
    }, [location.pathname]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleAuthSuccess = (userData) => {
        // Clear any previous sessions first
        localStorage.removeItem('operatorToken');
        localStorage.removeItem('operatorData');

        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthModalOpen(false);

        if (userData.role === 'superadmin') {
            navigate('/admin');
        } else {
            navigate('/');
        }

        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };

    const triggerLogin = (onSuccess) => {
        setPendingAction(() => onSuccess);
        setIsAuthModalOpen(true);
    };

    const handleNavigate = (view) => {
        if (view === 'landing' || view === 'bus') navigate('/');
        else if (view === 'seat-selection') navigate('/bus-results');
        else if (view === 'flight') navigate('/flights');
        else if (view === 'train') navigate('/trains');
        else if (view === 'hotel') navigate('/hotels');
        else if (view === 'train-results') navigate('/train-results');
        else if (view === 'train-review') navigate('/train-review');
        else if (view === 'train-passengers') navigate('/train-passengers');
        else if (view === 'train-payment') navigate('/train-payment');
        else if (view === 'hotel-results') navigate('/hotel-results');
        else if (view === 'hotel-review') navigate('/hotel-review');
        else if (view === 'hotel-guests') navigate('/hotel-passengers');
        else if (view === 'hotel-payment') navigate('/hotel-payment');
        else if (view === 'track-ticket') navigate('/track-ticket');
        else if (view === 'email-sms') navigate('/email-sms');
        else if (view === 'support') navigate('/support');
        else if (view === 'my-bookings') navigate('/my-bookings');
        else if (view === 'offers-page') navigate('/offers');
        else if (view === 'flight-results') navigate('/flight-results');
        else if (view === 'flight-review' || view === 'flight-passengers' || view === 'flight-payment') navigate('/flight-booking');
        else if (view === 'bus-payment') navigate('/bus-payment');
        else if (view === 'booking-confirmation') navigate('/booking-confirmation');
        else if (view === 'cancel-hotel') navigate('/cancel-hotel');
        else navigate('/' + view);
    };

    const isHome = location.pathname === '/';
    const lightBackgroundRoutes = [
        '/flights', '/trains', '/hotels', '/track-ticket', '/support', '/my-bookings',
        '/cancel', '/change-date', '/offers', '/email-sms', '/bus-results',
        '/passenger-details', '/booking-success', '/bus-payment', '/booking-confirmation',
        '/flight-results', '/flight-review',
        '/flight-passengers', '/flight-payment', '/flight-booking', '/train-results', '/train-review',
        '/train-passengers', '/train-payment', '/hotel-results', '/hotel-review',
        '/hotel-passengers', '/hotel-payment', '/hotel-booking-confirmation', '/ticket/verify'
    ];
    const isLightHero = lightBackgroundRoutes.includes(location.pathname)
        || location.pathname.startsWith('/legal')
        || location.pathname.startsWith('/payment/')
        || location.pathname.startsWith('/hotel/')
        || location.pathname.startsWith('/ticket/')
        || location.pathname.startsWith('/hotel-booking/');
    const isBusResults = location.pathname === '/bus-results';
    const isDashboardPath = location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/admine') ||
        location.pathname.startsWith('/operator') ||
        location.pathname.startsWith('/hotel-operator');

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {!isDashboardPath && <AdPopup />}
            {!isDashboardPath && <GlobalBanner />}
            {!isDashboardPath && !isSeatOverlayOpen && location.pathname !== '/flight-results' && location.pathname !== '/train-results' && (
                <Navbar
                    setView={handleNavigate}
                    activeTab={activeTab}
                    setActiveTab={(tab) => handleNavigate(tab)}
                    isLightHero={isLightHero}
                    isBusResults={isBusResults}
                    isHome={isHome}
                    isLoggedIn={isLoggedIn}
                    user={user}
                    onSignIn={() => setIsAuthModalOpen(true)}
                    onSignOut={() => {
                        setIsLoggedIn(false);
                        setUser(null);
                        localStorage.removeItem('token');
                        localStorage.removeItem('userData');
                    }}
                />
            )}

            <main>
                <Routes>
                    <Route path="/flight-booking" element={<FlightBookingFlow />} />
                    {/* Bus Route (Root) */}
                    <Route path="/" element={
                        <>
                            <Hero setView={handleNavigate} setSearchParams={setSearchParams} />
                            <Offers />
                            <WhyChoose />

                            <PrimoSection />
                        </>
                    } />

                    {/* Flight Route */}
                    <Route path="/flights" element={
                        <>
                            <FlightHero setView={handleNavigate} />
                            <FlightOffers />
                            <PopularFlightRoutes />
                            <AirlinesStrip />
                        </>
                    } />

                    {/* Train Route */}
                    <Route path="/trains" element={
                        <>
                            <TrainHero setView={handleNavigate} />
                            <PopularTrainRoutes />
                            <TrainFaresTable />
                        </>
                    } />

                    {/* Hotel Route */}
                    <Route path="/hotels" element={
                        <>
                            <HotelHero setView={handleNavigate} />
                            <FeaturedHotels setView={handleNavigate} />
                            <PopularHotelDestinations setView={handleNavigate} />
                        </>
                    } />

                    <Route path="/bus-results" element={
                        <BusResults
                            searchParams={searchParams}
                            setView={handleNavigate}
                            setSelectedBus={setSelectedBus}
                            setSelectedSeats={setSelectedSeats}
                            setBusBookingData={setBusBookingData}
                            setSearchParams={setSearchParams}
                            isLoggedIn={isLoggedIn}
                            triggerLogin={triggerLogin}
                            onOverlayToggle={setIsSeatOverlayOpen}
                        />
                    } />

                    <Route path="/bus-payment" element={
                        <BusPayment
                            bus={selectedBus}
                            seats={selectedSeats}
                            boarding={busBookingData?.boarding}
                            dropping={busBookingData?.dropping}
                            searchParams={searchParams}
                            passengers={passengers}
                            setView={handleNavigate}
                            onSuccess={(info) => {
                                setPaymentInfo(info);
                                setIsSeatOverlayOpen(false);
                                navigate(`/ticket/${info.bookingId}`);
                            }}
                        />
                    } />

                    <Route path="/payment/:bookingId" element={
                        <BusPayment
                            bus={selectedBus}
                            seats={selectedSeats}
                            boarding={busBookingData?.boarding}
                            dropping={busBookingData?.dropping}
                            searchParams={searchParams}
                            passengers={passengers}
                            setView={handleNavigate}
                            onSuccess={(info) => {
                                setPaymentInfo(info);
                                setIsSeatOverlayOpen(false);
                                navigate(`/ticket/${info.bookingId}`);
                            }}
                        />
                    } />

                    <Route path="/booking-confirmation" element={
                        <BookingConfirmation
                            bus={selectedBus}
                            seats={selectedSeats}
                            boarding={busBookingData?.boarding}
                            dropping={busBookingData?.dropping}
                            searchParams={searchParams}
                            paymentInfo={paymentInfo}
                            setView={handleNavigate}
                        />
                    } />

                    <Route path="/passenger-details" element={
                        <PassengerDetails
                            bus={selectedBus}
                            seats={selectedSeats}
                            setView={handleNavigate}
                            setPassengers={setPassengers}
                        />
                    } />

                    <Route path="/booking-success" element={
                        <BookingSuccess
                            bus={selectedBus}
                            seats={selectedSeats}
                            setView={handleNavigate}
                        />
                    } />

                    <Route path="/cancel-ticket/:bookingId" element={<CancelTicket />} />
                    <Route path="/cancel-hotel/:bookingId" element={<CancelHotel />} />
                    <Route path="/cancel" element={<CancelledBookings setView={handleNavigate} />} />
                    <Route path="/change-date" element={<ChangeTravelDate />} />
                    <Route path="/track-ticket" element={<TrackTicket />} />
                    <Route path="/email-sms" element={<TrackTicket isEmailSmsMode={true} />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/my-bookings" element={<MyBookings setView={handleNavigate} />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/legal/:type" element={<LegalPage />} />
                    
                    {/* New Footer Links */}
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/press" element={<Press />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                    <Route path="/flight-results" element={<FlightResults setView={handleNavigate} />} />
                    <Route path="/flight-confirmation/:bookingId" element={<FlightBookingConfirmation />} />
                    <Route path="/flight-ticket/:pnr" element={<FlightTicket />} />
                    <Route path="/flight/cancel/:bookingId" element={<FlightCancel />} />

                    {/* Deprecated: Old flight routes now handled by FlightBookingFlow */}
                    <Route path="/flight-review" element={<Navigate to="/flight-booking" replace />} />
                    <Route path="/flight-passengers" element={<Navigate to="/flight-booking" replace />} />
                    <Route path="/flight-payment" element={<Navigate to="/flight-booking" replace />} />
                    <Route path="/train-results" element={<TrainResults setView={handleNavigate} />} />
                    <Route path="/train-review" element={<TrainReview setView={handleNavigate} />} />
                    <Route path="/train-passengers" element={<TrainPassengerDetails setView={handleNavigate} />} />
                    <Route path="/train-payment" element={<TrainPayment setView={handleNavigate} />} />
                    <Route path="/booking" element={<TrainBooking />} />
                    <Route path="/train-success/:bookingId" element={<TrainSuccess />} />
                    <Route path="/ticket/verify/:pnr" element={<TicketVerification />} />
                    <Route path="/ticket/:pnr" element={<BusTicket />} />
                    <Route path="/hotel-results" element={<HotelResults setView={handleNavigate} />} />
                    <Route path="/hotel/:hotelId" element={<HotelDetails setView={handleNavigate} />} />
                    <Route path="/hotel-booking/:hotelId" element={<HotelBooking />} />
                    <Route path="/hotel-booking-confirmation" element={<HotelBookingConfirmation />} />
                    <Route path="/hotel-review" element={<HotelReview setView={handleNavigate} />} />
                    <Route path="/hotel-passengers" element={<HotelGuestDetails setView={handleNavigate} />} />
                    <Route path="/hotel-payment" element={<HotelPayment setView={handleNavigate} />} />
                    <Route path="/profile" element={<UserProfile user={user} />} />
                    <Route path="/admin-request" element={<AdminAccessRequest user={user} />} />
                    <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleAuthSuccess} />} />

                    {/* New Admin Panel Route - Protected */}
                    <Route
                        path="/admine/*"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                                <AdmineApp user={user} onLogout={() => {
                                    setIsLoggedIn(false);
                                    setUser(null);
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('userData');
                                    navigate('/');
                                }} />
                            </ProtectedRoute>
                        }
                    />

                    {/* Operator Panel - Protected */}
                    <Route
                        path="/operator/*"
                        element={
                            <ProtectedRoute allowedRoles={['operator']}>
                                <OperatorApp />
                            </ProtectedRoute>
                        }
                    />

                    {/* Hotel Operator Panel - Self-Protected */}
                    <Route path="/hotel-operator/*" element={<HotelOperatorApp />} />

                    {/* Old Admin Panel Route - Protected */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute allowedRoles={['superadmin']}>
                                <Provider store={store}>
                                    <AdminApp />
                                </Provider>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/access-denied" element={<AccessDenied />} />
                </Routes>
            </main>

            {!isDashboardPath && (
                <footer>
                    <Footer />
                </footer>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleAuthSuccess}
            />
        </div>
    )
}

export default App
