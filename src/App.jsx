import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import AdminDashboard from "./pages/auth/AdminDashboard/AdminDashboard.jsx";
import LoginForm from "./pages/auth/Login/LoginForm.jsx";
import RegistrationForm from "./pages/auth/Register/RegistrationForm.jsx";
import Dashboard from "./pages/user/Dashboard/Dashboard.jsx";
import UserProfile from "./pages/user/Profile/UserProfile.jsx";
import NotificationsPage from "./pages/user/Notifications/NotificationsPage.jsx";
import Message from "./pages/user/Notifications/Message.jsx";
import CarList from "./pages/vehicles/CarList/CarList.jsx";
import CarForm from "./pages/vehicles/CarForm/CarForm.jsx";
import CarSelection from "./pages/vehicles/CarSelection/CarSelection.jsx";
import BookingComponent from "./pages/bookings/BookingComponent/BookingComponent.jsx";
import BookingForm from "./pages/bookings/BookingForm/BookingForm.jsx";
import BookingHistory from "./pages/bookings/BookingHistory/BookingHistory.jsx";
import BookingList from "./pages/bookings/BookingList/BookingList.jsx";
import LocationList from "./pages/locations/LocationList/LocationList.jsx";
import LocationForm from "./pages/locations/LocationForm/LocationForm.jsx";
import LocationSelector from "./pages/locations/LocationSelector/LocationSelector.jsx";
import PaymentForm from "./pages/payments/PaymentForm/PaymentForm.jsx";
import PaymentConfirmation from "./pages/payments/PaymentConfirmation/PaymentConfirmation.jsx";
import InvoiceList from "./pages/invoices/InvoiceList/InvoiceList.jsx";
import InvoiceView from "./pages/invoices/InvoiceView/InvoiceView.jsx";
import InsuranceForm from "./pages/insurance/InsuranceForm/InsuranceForm.jsx";
import MaintenanceForm from "./pages/maintenance/MaintenanceForm/MaintenanceForm.jsx";
import SupportComponent from './pages/support/SupportComponent/SupportComponent.jsx';
import SupportForm from "./pages/support/SupportForm/SupportForm.jsx";
import SupportList from "./pages/support/SupportList/SupportList.jsx";
import SupportEditList from "./pages/support/SupportEditList/SupportEditList.jsx";
import ReviewComponent from './pages/reviews/ReviewComponent/ReviewComponent.jsx';
import ReviewForm from "./pages/reviews/ReviewForm/ReviewForm.jsx";
import ReviewList from "./pages/reviews/ReviewList/ReviewList.jsx";
import ReviewEditList from "./pages/reviews/ReviewEditList/ReviewEditList.jsx";
import Header from "./components/common/Header/Header.jsx";
import Footer from "./components/common/Footer/Footer.jsx";

import { useAuth } from "./context/AuthContext.jsx";

function App() {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = async () => {
        logout();
    };

    return (
        <div className={`app ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
            {isAuthenticated ? (
                <>
                    <Sidebar onLogout={handleLogout} />
                    <main className="main-content">
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard user={user} />} />
                            <Route path="/profile" element={<UserProfile user={user} />} />
                            <Route path="/bookings" element={<BookingComponent/>} />
                            <Route path="/make-booking" element={<BookingForm user={user} />} />
                            <Route path="/booking-history" element={<BookingHistory />} />
                            <Route path="/booking-list" element={<BookingList />} />
                            <Route path="/cars" element={<CarList />} />
                            <Route path="/register-car" element={<CarForm />} />
                            <Route path="/select-car" element={<CarSelection />} />
                            <Route path="/maintenance/:id/edit" element={<MaintenanceForm />} />
                            <Route path="/insurance/:id/edit" element={<InsuranceForm />} />
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/notification-test" element={<Message />} />
                            <Route path="/payment" element={<PaymentForm />} />
                            <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
                            <Route path="/invoice/:id" element={<InvoiceView />} />
                            <Route path={"/invoices"} element={<InvoiceList />} />
                            <Route path="/locations" element={<LocationList />} />
                            <Route path="/choose-location" element={<LocationSelector/>} />
                            <Route path="/register-location" element={<LocationForm/>} />
                            <Route path="/reviews" element={<ReviewComponent/>} />
                            <Route path="/review-form" element={<ReviewForm/>} />
                            <Route path="/edit-reviews" element={<ReviewEditList/>} />
                            <Route path="/review-list" element={<ReviewList/>} />
                            <Route path="/support" element={<SupportComponent/>} />
                            <Route path="/support-form" element={<SupportForm user={user} />} />
                            <Route path="/support-list" element={<SupportList/>} />
                            <Route path="/support-edit-list" element={<SupportEditList/>} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                </>
            ) : (
                <>
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegistrationForm />} />
                        <Route path="/make-booking" element={<BookingForm />} />
                        <Route path="/register-car" element={<CarForm />} />
                        <Route path="/cars" element={<CarList />} />
                        <Route path="/admin" element={<AdminDashboard/>} />
                        <Route path="/payment" element={<PaymentForm />} />
                        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
                        <Route path="/invoice/:id" element={<InvoiceView />} />
                        <Route path="/invoices" element={<InvoiceList />} />
                        <Route path="/locations" element={<LocationList />} />
                        <Route path="/choose-location" element={<LocationSelector/>} />
                        <Route path="/register-location" element={<LocationForm/>} />
                    </Routes>
                    <Footer />
                </main>
                </>
            )}
        </div>
    );
}

function Sidebar({ onLogout }) {
    const location = useLocation();
    return (
        <div className="sidebar">
            <h2>LG'S CAR HIRE</h2>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}><span className="icon">🏠</span><span className="title">Dashboard</span></Link>
                </li>
                <li>
                    <Link to="/bookings" className={`sidebar-link ${location.pathname === '/bookings' ? 'active' : ''}`}><span className="icon">🎒</span><span className="title">Bookings</span></Link>
                </li>
                <li>
                    <Link to="/cars" className={`sidebar-link ${location.pathname === '/cars' ? 'active' : ''}`}><span className="icon">🚗</span><span className="title">Cars</span></Link>
                </li>
                <li>
                    <Link to="/notifications" className={`sidebar-link ${location.pathname === '/notifications' ? 'active' : ''}`}><span className="icon">🔔</span><span className="title">Notifications</span></Link>
                </li>
                <li>
                    <Link to="/notification-test" className={`sidebar-link ${location.pathname === '/notification-test' ? 'active' : ''}`}><span className="icon">🧪</span><span className="title">Messages</span></Link>
                </li>
                <li>
                    <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}><span className="icon">👤</span><span className="title">Profile</span></Link>
                </li>
                <li>
                    <Link to="/payment" className={`sidebar-link ${location.pathname === '/payment' ? 'active' : ''}`}><span className="icon">💳</span><span className="title">Payments</span></Link>
                </li>
                <li>
                    <Link to="/invoices" className={`sidebar-link ${location.pathname === '/invoices' ? 'active' : ''}`}><span className="icon">📄</span><span className="title">Invoices</span></Link>
                </li>
                <li>
                    <Link to="/reviews" className={`sidebar-link ${location.pathname === '/reviews' ? 'active' : ''}`}><span className="icon">⭐</span><span className="title">Reviews</span></Link>
                </li>
                <li>
                    <Link to="/support" className={`sidebar-link ${location.pathname === '/support' ? 'active' : ''}`}><span className="icon">👨‍💻</span><span className="title">Query</span></Link>
                </li>
                <li>
                    <Link to="/locations" className={`sidebar-link ${location.pathname === '/locations' ? 'active' : ''}`}><span className="icon">📍</span><span className="title">Locations</span></Link>
                </li>
                <li>
                    <Link to="/register-location" className={`sidebar-link ${location.pathname === '/register-location' ? 'active' : ''}`}><span className="icon">📌</span><span className="title">Add Location</span></Link>
                </li>
                <li>
                    <Link to="/register-car" className={`sidebar-link ${location.pathname === '/register-car' ? 'active' : ''}`}><span className="icon">🚗</span><span className="title">Add Car</span></Link>
                </li>
                <li className="logout-item">
                    <button onClick={onLogout} className="logout-btn">
                        <span className="icon">🚪</span>
                        <span className="title">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default App;
