import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css'
import RegistrationForm from "./pages/Users/RegistrationForm.jsx";
import LoginForm from "./pages/Users/LoginForm.jsx";
import Dashboard from "./pages/Users/Dashboard.jsx";
import UserProfile from "./pages/Users/UserProfile.jsx";
import userService from "./services/userService.js";
import Home from "./Home.jsx";
import "./index.css";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx";
import CarForm from "./pages/Vehicle/CarForm.jsx";
import CarList from "./pages/Vehicle/CarList.jsx";
import AdminDashboard from "./pages/Authentication/AdminDashboard.jsx";
import PaymentForm from "./pages/Reservation/Payment/PaymentForm.jsx";
import PaymentConfirmation from "./pages/Reservation/Payment/PaymentConfirmation.jsx";
import InvoiceView from "./pages/Reservation/Invoice/InvoiceView.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (userService.isAuthenticated()) {
                    const storedUser = userService.getCurrentUser();
                    const userRole = userService.getUserRole();

                    if (storedUser) {
                        try {
                            const freshProfile = await userService.getProfile(storedUser.id);
                            setCurrentUser({ ...freshProfile, role: userRole });
                        } catch (error) {
                            setCurrentUser({ ...storedUser, role: userRole });
                        }
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (userData) => {
        console.log('🔐 Login successful:', userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);

        if (userData.id) {
            try {
                const fullProfile = await userService.getProfile(userData.id);
                setCurrentUser({ ...fullProfile, role: userData.role });
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        }
    };

    const handleLogout = () => {
        userService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-white">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                {isAuthenticated ? (
                    <>
                        <Sidebar onLogout={handleLogout} currentUser={currentUser} />
                        <main className="main-content">
                            <AuthenticatedRoutes currentUser={currentUser} />
                        </main>
                    </>
                ) : (
                    <main className="main-content">
                        <Routes>
                            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                            <Route path="/register" element={<RegistrationForm />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </main>
                )}
            </div>
        </Router>
    );
}

function AuthenticatedRoutes({ currentUser }) {
    const location = useLocation();
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'admin';

    const getHeader = () => {
        switch(location.pathname) {
            case '/make-booking':
                return <Header title="MAKE YOUR BOOKING" />;
            case '/booking-history':
                return <Header title="VIEW YOUR BOOKING HISTORY" />;
            case '/locations':
                return <Header title="VIEW AVAILABLE RENTING LOCATIONS" />;
            case '/bookings':
                return <Header title="VIEW YOUR BOOKINGS" />;
            case '/cars':
                return <Header title="VIEW AVAILABLE CARS" />;
            case '/register-location':
                return isAdmin ? <Header title="REGISTER A NEW RENTING LOCATION" /> : null;
            case '/register-car':
                return isAdmin ? <Header title="REGISTER A NEW CAR" /> : null;
            case '/admin':
                return isAdmin ? <Header title="ADMIN DASHBOARD" /> : null;
            default:
                return null;
        }
    };

    return (
        <>
            {getHeader()}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
                <Route path="/profile" element={<UserProfile user={currentUser} />} />
                <Route path="/make-booking" element={<BookingForm user={currentUser} />} />
                <Route path="/bookings" element={<BookingList user={currentUser} />} />
                <Route path="/booking-history" element={<BookingHistory user={currentUser} />} />
                <Route path="/locations" element={<LocationList />} />
                <Route path="/cars" element={<CarList />} />
                <Route path="/notifications" element={<div className="p-8"><h2 className="text-2xl text-white">Notifications</h2><p className="text-gray-400 mt-4">No new notifications</p></div>} />
                <Route path="/payments" element={<div className="p-8"><h2 className="text-2xl text-white">Payment History</h2><p className="text-gray-400 mt-4">No payments yet</p></div>} />
                {isAdmin && (
                    <>
                        <Route path="/admin" element={<AdminDashboard user={currentUser} />} />
                        <Route path="/register-location" element={<LocationForm />} />
                        <Route path="/register-car" element={<CarForm />} />
                    </>
                )}

                {!isAdmin && (
                    <>
                        <Route path="/admin" element={<Navigate to="/" replace />} />
                        <Route path="/register-location" element={<Navigate to="/" replace />} />
                        <Route path="/register-car" element={<Navigate to="/" replace />} />
                    </>
                )}

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </>
    );
}

function Sidebar({ onLogout, currentUser }) {
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'admin';
    const isCustomer = currentUser?.role === 'CUSTOMER' || currentUser?.role === 'customer';

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            onLogout();
            navigate('/login');
        }
    };

    return (
        <div className="sidebar">
            <h2>LG'S CAR HIRE</h2>

            <div style={{
                padding: '15px',
                borderBottom: '1px solid #555',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                <p style={{ color: '#007bff', fontSize: '0.9rem', marginBottom: '5px' }}>
                    Welcome, {currentUser?.name || 'User'}
                </p>
                <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
                    {isAdmin ? '👑 Admin' : '👤 Customer'}
                </p>
            </div>

            <ul className="sidebar-menu">
                <li>
                    <Link
                        to="/"
                        className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        <span className="icon">🏠</span>
                        <span className="title">Home</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard"
                        className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        <span className="icon">📊</span>
                        <span className="title">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/cars"
                        className={`sidebar-link ${location.pathname === '/cars' ? 'active' : ''}`}
                    >
                        <span className="icon">🚗</span>
                        <span className="title">Browse Cars</span>
                    </Link>
                </li>

                <li>
                    <Link
                        to="/make-booking"
                        className={`sidebar-link ${location.pathname === '/make-booking' ? 'active' : ''}`}
                    >
                        <span className="icon">📝</span>
                        <span className="title">Make Booking</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/bookings"
                        className={`sidebar-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                    >
                        <span className="icon">🎒</span>
                        <span className="title">My Bookings</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/booking-history"
                        className={`sidebar-link ${location.pathname === '/booking-history' ? 'active' : ''}`}
                    >
                        <span className="icon">📜</span>
                        <span className="title">Booking History</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/locations"
                        className={`sidebar-link ${location.pathname === '/locations' ? 'active' : ''}`}
                    >
                        <span className="icon">📍</span>
                        <span className="title">Locations</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/payments"
                        className={`sidebar-link ${location.pathname === '/payments' ? 'active' : ''}`}
                    >
                        <span className="icon">💳</span>
                        <span className="title">Payments</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/notifications"
                        className={`sidebar-link ${location.pathname === '/notifications' ? 'active' : ''}`}
                    >
                        <span className="icon">🔔</span>
                        <span className="title">Notifications</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/profile"
                        className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                    >
                        <span className="icon">👤</span>
                        <span className="title">Profile</span>
                    </Link>
                </li>
                {isAdmin && (
                    <>
                        <li style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #555' }}>
                            <p style={{ color: '#aaa', fontSize: '0.8rem', padding: '0 20px', marginBottom: '10px' }}>
                                ADMIN TOOLS
                            </p>
                        </li>
                        <li>
                            <Link
                                to="/admin"
                                className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                            >
                                <span className="icon">⚙️</span>
                                <span className="title">Admin Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/register-car"
                                className={`sidebar-link ${location.pathname === '/register-car' ? 'active' : ''}`}
                            >
                                <span className="icon">➕</span>
                                <span className="title">Register Car</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/register-location"
                                className={`sidebar-link ${location.pathname === '/register-location' ? 'active' : ''}`}
                            >
                                <span className="icon">🏢</span>
                                <span className="title">Register Location</span>
                            </Link>
                        </li>
                    </>
                )}

                <li className="logout-item">
                    <button onClick={handleLogout} className="logout-btn">
                        <span className="icon">🚪</span>
                        <span className="title">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default App;