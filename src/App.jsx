import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';

// User Components
import RegistrationForm from "./pages/Users/RegistrationForm.jsx";
import LoginForm from "./pages/Users/LoginForm.jsx";
import Dashboard from "./pages/Users/Dashboard.jsx";
import UserProfile from "./pages/Users/UserProfile.jsx";
import NotificationsPage from "./pages/Users/NotificationsPage.jsx";
import Message from "./pages/Users/Message.jsx";

// Authentication
import AdminDashboard from "./pages/Authentication/AdminDashboard.jsx";

// Common Components
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";

// Booking Components
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import BookingComponent from "./pages/Reservation/Booking/BookingComponent.jsx";
import CarSelection from "./pages/Reservation/Booking/CarSelection.jsx";

// Payment Components
import PaymentForm from "./pages/Reservation/Payment/PaymentForm.jsx";
import PaymentConfirmation from "./pages/Reservation/Payment/PaymentConfirmation.jsx";

// Invoice Components
import InvoiceView from "./pages/Reservation/Invoice/InvoiceView.jsx";
import InvoiceList from "./pages/Reservation/Invoice/InvoiceList.jsx";

// Location Components
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import MapsPage from "./pages/Reservation/Location/MapsPage.jsx";

// Vehicle Components
import CarForm from "./pages/Vehicle/CarForm.jsx";
import CarList from "./pages/Vehicle/CarList.jsx";

// Feedback Components
import ReviewForm from "./pages/Feedback/Review/reviewForm.jsx";
import ReviewList from "./pages/Feedback/Review/reviewList.jsx";
import ReviewComponent from './pages/Feedback/Review/reviewComponent.jsx';

// Support Components
import SupportForm from "./pages/Reservation/Support/supportForm.jsx";
import SupportList from "./pages/Reservation/Support/supportList.jsx";
import SupportComponent from './pages/Reservation/Support/supportComponent.jsx';

// Insurance Components
import InsuranceForm from "./pages/Reservation/Insurance/insuranceForm.jsx";
import InsuranceList from "./pages/Reservation/Insurance/insuranceList.jsx";
import InsuranceComponent from "./pages/Reservation/Insurance/insuranceComponent.jsx";

// Maintenance Components
import MaintenanceForm from "./pages/Reservation/Maintenance/maintenanceForm.jsx";
import MaintenanceList from "./pages/Reservation/Maintenance/maintenanceList.jsx";
import MaintenanceComponent from "./pages/Reservation/Maintenance/maintenanceComponent.jsx";

// Public Pages
import Home from "./Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./Contact.jsx";

// Services
import { getUserProfile } from "./scripts";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (userData) => {
    console.log('Login received userData:', userData);
    console.log('User ID in login response:', userData.id);
    console.log('All user data properties:', Object.keys(userData));

    setIsAuthenticated(true);
    setCurrentUser(userData);
    
    // Store user in both session and local storage
    sessionStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));

    // Fetch complete profile data using the user ID
    if (userData.id) {
      console.log('Fetching complete profile...');
      try {
        const fullProfile = await getUserProfile(userData.id);
        console.log('Full profile loaded:', fullProfile);
        console.log('User ID in profile:', fullProfile.id);
        setCurrentUser(fullProfile); // Update with complete profile data
        
        // Update storage with full profile
        sessionStorage.setItem('user', JSON.stringify(fullProfile));
        localStorage.setItem('user', JSON.stringify(fullProfile));
      } catch (error) {
        console.error('Failed to fetch complete profile:', error);
        // Keep the basic user data if profile fetch fails
      }
    } else {
      console.log('No user ID available, skipping profile fetch');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Clear user from storage
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className={`app ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
        {isAuthenticated ? (
          // Authenticated user - show sidebar with main menu
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
                <Route path="/notification-test" element={<Message user={currentUser} />} />
                <Route path="/payment" element={<PaymentForm user={currentUser} />} />
                <Route path="/payment/confirmation" element={<PaymentConfirmation user={currentUser} />} />
                <Route path="/invoice/:id" element={<InvoiceView />} />
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/locations" element={<LocationList />} />
                <Route path="/register-location" element={<LocationForm/>} />
                <Route path="/maps" element={<MapsPage />} />
                <Route path="/reviews" element={<ReviewComponent/>} />
                <Route path="/review-form" element={<ReviewForm/>} />
                <Route path="/review-list" element={<ReviewList/>} />
                <Route path="/support" element={<SupportComponent user={currentUser} />} />
                <Route path="/support-form" element={<SupportForm user={currentUser} />} />
                <Route path="/support-list" element={<SupportList user={currentUser} />} />
                <Route path="/insurance" element={<InsuranceComponent user={currentUser} />} />
                <Route path="/insurance-form" element={<InsuranceForm user={currentUser} />} />
                <Route path="/insurance-list" element={<InsuranceList />} />
                <Route path="/maintenance" element={<MaintenanceComponent user={currentUser} />} />
                <Route path="/maintenance-form" element={<MaintenanceForm user={currentUser} />} />
                <Route path="/maintenance-list" element={<MaintenanceList />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          // Not authenticated - show public pages with header
          <>
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

// Sidebar component with proper React Router navigation
function Sidebar({ onLogout }) {
    const location = useLocation();

    return (
        <div className="sidebar">
            <h2>LG'S CAR HIRE</h2>
            <ul className="sidebar-menu">
                <li>
                    <Link
                        to="/dashboard"
                        className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        <span className="icon">🏠</span>
                        <span className="title">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/bookings"
                        className={`sidebar-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                    >
                        <span className="icon">🎒</span>
                        <span className="title">Bookings</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/cars"
                        className={`sidebar-link ${location.pathname === '/cars' ? 'active' : ''}`}
                    >
                        <span className="icon">🚗</span>
                        <span className="title">Cars</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/register-car"
                        className={`sidebar-link ${location.pathname === '/register-car' ? 'active' : ''}`}
                    >
                        <span className="icon">➕</span>
                        <span className="title">Add Car</span>
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
                        to="/notification-test"
                        className={`sidebar-link ${location.pathname === '/notification-test' ? 'active' : ''}`}
                    >
                        <span className="icon">🧪</span>
                        <span className="title">Messages</span>
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
                <li>
                    <Link
                        to="/payment"
                        className={`sidebar-link ${location.pathname === '/payment' ? 'active' : ''}`}
                    >
                        <span className="icon">💳</span>
                        <span className="title">Payments</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/invoices"
                        className={`sidebar-link ${location.pathname === '/invoices' ? 'active' : ''}`}
                    >
                        <span className="icon">📄</span>
                        <span className="title">Invoices</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/insurance"
                        className={`sidebar-link ${location.pathname === '/insurance' ? 'active' : ''}`}
                    >
                        <span className="icon">🛡️</span>
                        <span className="title">Insurance</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/maintenance"
                        className={`sidebar-link ${location.pathname === '/maintenance' ? 'active' : ''}`}
                    >
                        <span className="icon">🔧</span>
                        <span className="title">Maintenance</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/reviews"
                        className={`sidebar-link ${location.pathname === '/reviews' ? 'active' : ''}`}
                    >
                        <span className="icon">⭐</span>
                        <span className="title">Reviews</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/support"
                        className={`sidebar-link ${location.pathname === '/support' ? 'active' : ''}`}
                    >
                        <span className="icon">👨‍💻</span>
                        <span className="title">Query</span>
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
                        to="/register-location"
                        className={`sidebar-link ${location.pathname === '/register-location' ? 'active' : ''}`}
                    >
                        <span className="icon">📌</span>
                        <span className="title">Add Location</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/maps"
                        className={`sidebar-link ${location.pathname === '/maps' ? 'active' : ''}`}
                    >
                        <span className="icon">M</span>
                        <span className="title">Maps</span>
                    </Link>
                </li>
                <li className="logout-item">
                    <button onClick={onLogout} className="logout-btn">
                        <span className="icon">L</span>
                        <span className="title">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default App;