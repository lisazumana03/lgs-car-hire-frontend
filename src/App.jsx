import { useState } from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Contact from "./Contact.jsx";
import Home from "./Home.jsx";
import "./index.css";
import About from "./pages/About.jsx";
import AdminDashboard from "./pages/Authentication/AdminDashboard.jsx";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import ReviewComponent from './pages/Feedback/Review/reviewComponent.jsx';
import ReviewForm from "./pages/Feedback/Review/reviewForm.jsx";
import ReviewList from "./pages/Feedback/Review/reviewList.jsx";
import ReviewEditList from "./pages/Feedback/Review/reviewEditList.jsx";
import BookingComponent from "./pages/Reservation/Booking/BookingComponent.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import CarSelection from "./pages/Reservation/Booking/CarSelection.jsx";
import InvoiceList from "./pages/Reservation/Invoice/InvoiceList.jsx";
import InvoiceView from "./pages/Reservation/Invoice/InvoiceView.jsx";
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import LocationSelector from "./pages/Reservation/Location/LocationSelector.jsx";
import PaymentConfirmation from "./pages/Reservation/Payment/PaymentConfirmation.jsx";
import PaymentForm from "./pages/Reservation/Payment/PaymentForm.jsx";
import SupportComponent from './pages/Reservation/Support/supportComponent.jsx';
import SupportForm from "./pages/Reservation/Support/supportForm.jsx";
import SupportList from "./pages/Reservation/Support/supportList.jsx";
import Dashboard from "./pages/Users/Dashboard.jsx";
import LoginForm from "./pages/Users/LoginForm.jsx";
import Message from "./pages/Users/Message.jsx";
import NotificationsPage from "./pages/Users/NotificationsPage.jsx";
import RegistrationForm from "./pages/Users/RegistrationForm.jsx";
import UserProfile from "./pages/Users/UserProfile.jsx";
import CarForm from "./pages/Vehicle/CarForm.jsx";
import CarList from "./pages/Vehicle/CarList.jsx";
import { getUserProfile } from "./scripts";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const handleLogin = async (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);
        if (userData.id) {
            try {
                const fullProfile = await getUserProfile(userData.id);
                setCurrentUser(fullProfile);
            } catch (error) {
                // Keep the basic user data if profile fetch fails
                console.error("Failed to fetch full user profile:", error);
            }
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <Router>
            <div className={`app ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
                {isAuthenticated ? (
                    <>
                        <Sidebar onLogout={handleLogout} />
                        <main className="main-content">
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
                                <Route path="/profile" element={<UserProfile user={currentUser} />} />
                                <Route path="/bookings" element={<BookingComponent/>} />
                                <Route path="/make-booking" element={<BookingForm user={currentUser} />} />
                                <Route path="/booking-history" element={<BookingHistory />} />
                                <Route path="/booking-list" element={<BookingList />} />
                                <Route path="/cars" element={<CarList />} />
                                <Route path="/register-car" element={<CarForm />} />
                                <Route path="/select-car" element={<CarSelection />} />
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
                                <Route path="/support-form" element={<SupportForm/>} />
                                <Route path="/support-list" element={<SupportList/>} />
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
                            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                            <Route path="/register" element={<RegistrationForm />} />
                            <Route path="/make-booking" element={<BookingForm />} />
                            <Route path="/bookings" element={<BookingList />} />
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
        </Router>
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