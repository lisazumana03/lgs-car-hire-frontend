import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import RegistrationForm from "./pages/Users/RegistrationForm.jsx";
import LoginForm from "./pages/Users/LoginForm.jsx";
import Dashboard from "./pages/Users/Dashboard.jsx";
import UserProfile from "./pages/Users/UserProfile.jsx";
import { getUserProfile } from "./scripts";
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


function App() {
    
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (userData) => {
    console.log('🔐 Login received userData:', userData);
    console.log('🆔 User ID in login response:', userData.id);
    
    setIsAuthenticated(true);
    setCurrentUser(userData);
    
    // Fetch complete profile data using the user ID
    if (userData.id) {
      console.log('📡 Fetching complete profile...');
      try {
        const fullProfile = await getUserProfile(userData.id);
        console.log('✅ Full profile loaded:', fullProfile);
        console.log('🆔 User ID in profile:', fullProfile.id);
        setCurrentUser(fullProfile); // Update with complete profile data
      } catch (error) {
        console.error('❌ Failed to fetch complete profile:', error);
        // Keep the basic user data if profile fetch fails
      }
    } else {
      console.log('⚠️ No user ID available, skipping profile fetch');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          // Authenticated user - show sidebar with main menu
          <>
            <Sidebar onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
                <Route path="/profile" element={<UserProfile user={currentUser} />} />
                  <Route path="/bookings" element={<div> Bookings Section </div>} />
                <Route path="/cars" element={<div>Cars Page</div>} />
                <Route path="/notifications" element={<div>Notifications Page</div>} />
                <Route path="/history" element={<div>History Page</div>} />
                <Route path="/payments" element={<div>Payments Page</div>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          // Not authenticated - show login/register forms
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
        <li>
          <Link
            to="/history"
            className={`sidebar-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            <span className="icon">📜</span>
            <span className="title">History</span>
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
        <li className="logout-item">
          <button onClick={onLogout} className="logout-btn">
            <span className="icon">🚪</span>
            <span className="title">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );

function AdminHeader(){
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">ADMIN DASHBOARD</h1>
        </header>
    );
}

function BookingHeader() {
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">MAKE YOUR BOOKING</h1>
        </header>
    );
}

function BookingHistoryHeader() {
    return (
        <header className=" text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW YOUR BOOKING HISTORY</h1>
        </header>
    );
}

function LocationHeader() {
    return (
        <header className=" text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">REGISTER A NEW RENTING LOCATION</h1>
        </header>
    );
}

function LocationViewHeader() {
    return (
        <header className=" text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW AVAILABLE RENTING LOCATIONS</h1>
        </header>
    );
}

function BookingListHeader() {
    return (
        <header className=" text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW YOUR BOOKINGS</h1>
        </header>
    );
}

function CarHeader() {
    return (
        <header className=" text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">REGISTER A NEW CAR</h1>
        </header>
    );
}

function CarListHeader() {
    return (
        <header className=" text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW AVAILABLE CARS</h1>
        </header>
    );
}

function AppContent() {
    const location = useLocation();
    const isAdminMainPage = location.pathname === "/admin";
    const isBookingPage = location.pathname === "/make-booking";
    const isLocationListPage = location.pathname === "/locations";
    const isHomePage = location.pathname === "/";
    const isBookingListPage = location.pathname === "/bookings";
    const isBookingHistoryPage = location.pathname === "/booking-history";
    const isLocationPage = location.pathname === "/register-location";
    const isCarPage = location.pathname === "/register-car";
    const isCarListPage = location.pathname === "/cars";

    return (
        <>
            {isBookingPage ? (
                <BookingHeader />
            ) : isAdminMainPage ? (
                <AdminHeader />
            ) : isLocationListPage ? (
                <LocationViewHeader />
            ) : isBookingListPage ? (
                <BookingListHeader />
            ) : isLocationPage ? (
                <LocationHeader />
            ) : isBookingHistoryPage ? (
                <BookingHistoryHeader />
            ) : isCarPage ? (
                <CarHeader />
            ) : isCarListPage ? (
                <CarListHeader />
            ) : (
                <Header showNavigation={isHomePage} />
            )}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/make-booking" element={<BookingForm />} />
                    <Route path="/bookings" element={<BookingList />} />
                    <Route path="/booking-history" element={<BookingHistory />} />
                    <Route path="/locations" element={<LocationList />} />
                    <Route path="/register-location" element={<LocationForm/>} />
                    <Route path="/register-car" element={<CarForm />} />
                    <Route path="/cars" element={<CarList />} />
                    <Route path="/admin" element={<AdminDashboard/>} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

}


function Routers() {
     return (
         <Router>
             <AppContent />
         </Router>
    );
}

export default App;