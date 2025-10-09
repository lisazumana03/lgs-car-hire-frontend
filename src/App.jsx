import { useState, useEffect } from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Contact from "./Contact.jsx";
import Home from "./Home.jsx";
import "./index.css";
import About from "./pages/About.jsx";
import AdminDashboard from "./pages/Authentication/AdminDashboard.jsx";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import BookingComponent from "./pages/Reservation/Booking/BookingComponent.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import CarSelection from "./pages/Reservation/Booking/CarSelection.jsx";
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import LocationSelector from "./pages/Reservation/Location/LocationSelector.jsx";
import Dashboard from "./pages/Users/Dashboard.jsx";
import LoginForm from "./pages/Users/LoginForm.jsx";
import RegistrationForm from "./pages/Users/RegistrationForm.jsx";
import UserProfile from "./pages/Users/UserProfile.jsx";
import CarForm from "./pages/Vehicle/CarForm.jsx";
import CarList from "./pages/Vehicle/CarList.jsx";
import { isAuthenticated, getUserData, logout } from "./services/authService.js";

function App() {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [currentUser, setCurrentUser] = useState(getUserData());

    useEffect(() => {
        const checkAuth = () => {
            setAuthenticated(isAuthenticated());
            setCurrentUser(getUserData());
        };
        checkAuth();
    }, []);

    const handleLogin = async (userData) => {
        setAuthenticated(true);
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <Router>
            <div className={`app ${authenticated ? 'authenticated' : 'unauthenticated'}`}>
                {authenticated ? (
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
                                <Route path="/locations" element={<LocationList />} />
                                <Route path="/choose-location" element={<LocationSelector/>} />
                                <Route path="/register-location" element={<LocationForm/>} />
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
                            <Route path="/cars" element={<CarList />} />
                            <Route path="/locations" element={<LocationList />} />
                            <Route path="/admin" element={<AdminDashboard/>} />
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
                    <Link to="/bookings" className={`sidebar-link ${location.pathname === '/bookings' ? 'active' : ''}`}><span className="icon">📅</span><span className="title">Bookings</span></Link>
                </li>
                <li>
                    <Link to="/cars" className={`sidebar-link ${location.pathname === '/cars' ? 'active' : ''}`}><span className="icon">🚗</span><span className="title">Cars</span></Link>
                </li>
                <li>
                    <Link to="/locations" className={`sidebar-link ${location.pathname === '/locations' ? 'active' : ''}`}><span className="icon">📍</span><span className="title">Locations</span></Link>
                </li>
                <li>
                    <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}><span className="icon">👤</span><span className="title">Profile</span></Link>
                </li>
                <li>
                    <Link to="/register-location" className={`sidebar-link ${location.pathname === '/register-location' ? 'active' : ''}`}><span className="icon">📌</span><span className="title">Add Location</span></Link>
                </li>
                <li>
                    <Link to="/register-car" className={`sidebar-link ${location.pathname === '/register-car' ? 'active' : ''}`}><span className="icon">➕</span><span className="title">Add Car</span></Link>
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