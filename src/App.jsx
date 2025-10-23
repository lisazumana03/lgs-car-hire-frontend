import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';

// Admin Components
import LocationManagement from "./pages/Admin/LocationManagement.jsx";
import UserManagement from "./pages/Admin/UserManagement.jsx";
import BookingManagement from "./pages/Admin/BookingManagement.jsx";
import PaymentsManagement from "./pages/Admin/PaymentsManagement.jsx";
import MaintenanceManagement from "./pages/Admin/MaintenanceManagement.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute.jsx';

// User Components
import RegistrationForm from "./pages/Users/RegistrationForm.jsx";
import LoginForm from "./pages/Users/LoginForm.jsx";
import Dashboard from "./pages/Users/Dashboard.jsx";
import UserProfile from "./pages/Users/UserProfile.jsx";
import NotificationsPage from "./pages/Users/NotificationsPage.jsx";
import Message from "./pages/Users/Message.jsx";

// Common Components
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";

// Booking Components
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import BookingComponent from "./pages/Reservation/Booking/BookingComponent.jsx";
import BookingDetails from "./pages/Reservation/Booking/BookingDetails.jsx";
import CarSelection from "./pages/Reservation/Booking/CarSelection.jsx";

// Payment Components
import PaymentForm from "./pages/Reservation/Payment/PaymentForm.jsx";
import PaymentConfirmation from "./pages/Reservation/Payment/PaymentConfirmation.jsx";
import PaymentSuccess from "./pages/Reservation/Payment/PaymentSuccess.jsx";

// Invoice Components
import InvoiceView from "./pages/Reservation/Invoice/InvoiceView.jsx";
import InvoiceList from "./pages/Reservation/Invoice/InvoiceList.jsx";

// Location Components
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import LocationSelector from "./pages/Reservation/Location/LocationSelector.jsx";

// Vehicle Components
import CarForm from "./pages/Vehicle/CarForm.jsx";
import CarList from "./pages/Vehicle/CarList.jsx";
import ManageCars from "./pages/Vehicle/ManageCars.jsx";

// Feedback Components
import ReviewForm from "./pages/Feedback/Review/reviewForm.jsx";
import ReviewList from "./pages/Feedback/Review/reviewList.jsx";
import ReviewComponent from './pages/Feedback/Review/reviewComponent.jsx';

// Support Components
import SupportForm from "./pages/Reservation/Support/supportForm.jsx";
import SupportList from "./pages/Reservation/Support/supportList.jsx";
import SupportComponent from './pages/Reservation/Support/supportComponent.jsx';

// Insurance Components
import InsuranceForm from "./pages/Reservation/Insurance/InsuranceForm.jsx";
import InsuranceList from "./pages/Reservation/Insurance/insuranceList.jsx";
import InsurancePage from "./pages/Reservation/Insurance/InsurancePage.jsx";

// Maintenance Components
import MaintenanceForm from "./pages/Reservation/Maintenance/MaintenanceForm.jsx";
import MaintenanceList from "./pages/Reservation/Maintenance/maintenanceList.jsx";
import MaintenancePage from "./pages/Reservation/Maintenance/MaintenancePage.jsx";

// Public Pages
import Home from "./Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./Contact.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Check for existing JWT token on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setCurrentUser(user);
                console.log('User authenticated from localStorage:', user);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogin = async (authResponse) => {
        console.log('Login received auth response:', authResponse);

        // authResponse structure: { token, user, tokenType }
        const { user, token } = authResponse;

        if (!token || !user) {
            console.error('Invalid auth response - missing token or user');
            return;
        }

        // JWT token and user are already saved by LoginForm
        // Just update app state
        setIsAuthenticated(true);
        setCurrentUser(user);

        console.log('User authenticated:', user);
        console.log('JWT Token saved to localStorage');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);

        // Clear ALL authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        console.log('User logged out - all auth data cleared');
    };

    return (
        <Router>
            <div className={`app ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
                {isAuthenticated ? (
                    // Authenticated user - show sidebar with main menu
                    <>
                        <Sidebar onLogout={handleLogout} currentUser={currentUser} />
                        <main className="main-content">
                            <Routes>
                                {/* User Routes */}
                                <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
                                <Route path="/profile" element={<UserProfile user={currentUser} />} />

                                {/* Booking Routes */}
                                <Route path="/bookings" element={<BookingComponent/>} />
                                <Route path="/make-booking" element={<BookingForm user={currentUser} />} />
                                <Route path="/booking-history" element={<BookingHistory />} />
                                <Route path="/booking-list" element={<BookingList />} />
                                <Route path="/booking-details" element={<BookingDetails />} />
                                <Route path="/booking-details/:id" element={<BookingDetails />} />

                                {/* Car Routes */}
                                <Route path="/cars" element={<CarList />} />
                                <Route path="/select-car" element={<CarSelection />} />

                                {/* Admin and Car Owner only - Manage Cars */}
                                <Route
                                    path="/manage-cars"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <ManageCars />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Admin and Car Owner only - Register Car */}
                                <Route
                                    path="/register-car"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <CarForm />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Notification Routes */}
                                <Route path="/notifications" element={<NotificationsPage />} />

                                {/* Admin and Car Owner only - Messages */}
                                <Route
                                    path="/notification-test"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <Message user={currentUser} />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Payment Routes */}
                                <Route path="/payment" element={<PaymentForm user={currentUser} />} />
                                <Route path="/payment/confirmation" element={<PaymentConfirmation user={currentUser} />} />
                                <Route path="/payment/success" element={<PaymentSuccess />} />

                                {/* Invoice Routes */}
                                <Route path="/invoice/:id" element={<InvoiceView />} />
                                <Route path="/invoices" element={<InvoiceList />} />

                                {/* Location Routes - Admin predefined locations only */}
                                <Route path="/locations" element={<LocationList />} />
                                <Route path="/choose-location" element={<LocationSelector />} />

                                {/* Admin only - Location Management */}
                                <Route
                                    path="/register-location"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <LocationForm/>
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Review Routes */}
                                <Route path="/reviews" element={<ReviewComponent/>} />
                                <Route path="/review-form" element={<ReviewForm/>} />
                                <Route path="/review-list" element={<ReviewList/>} />

                                {/* Support Routes */}
                                <Route path="/support" element={<SupportComponent user={currentUser} />} />
                                <Route path="/support-form" element={<SupportForm user={currentUser} />} />
                                <Route path="/support-list" element={<SupportList user={currentUser} />} />

                                {/* ADMIN PANEL ROUTES */}
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin/users"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <UserManagement />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin/cars"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <ManageCars />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin/locations"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <LocationManagement />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin/bookings"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <BookingManagement />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin/payments"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <PaymentsManagement />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin/maintenance"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <MaintenanceManagement />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* ADDED: Admin Insurance Route */}
                                <Route
                                    path="/admin/insurance"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN']}>
                                            <InsurancePage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Insurance Routes - Admin and Car Owner */}
                                <Route
                                    path="/insurance"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <InsurancePage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/insurance-form"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <InsuranceForm user={currentUser} />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/insurance-list"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <InsuranceList />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Maintenance Routes - Admin and Car Owner */}
                                <Route
                                    path="/maintenance"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <MaintenancePage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/maintenance-form"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <MaintenanceForm user={currentUser} />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/maintenance-list"
                                    element={
                                        <ProtectedRoute requireRole={['ADMIN', 'CAR_OWNER']}>
                                            <MaintenanceList />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Default Route - Redirect based on role */}
                                <Route path="*" element={
                                    currentUser?.role === 'ADMIN' ?
                                        <Navigate to="/admin/dashboard" replace /> :
                                        <Navigate to="/dashboard" replace />
                                } />
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
function Sidebar({ onLogout, currentUser }) {
    const location = useLocation();
    const isAdmin = currentUser?.role === 'ADMIN';
    const isCarOwner = currentUser?.role === 'CAR_OWNER';
    const isCustomer = currentUser?.role === 'CUSTOMER';

    return (
        <div className="sidebar">
            <h2>LG'S CAR HIRE</h2>

            {/* User Info Display */}
            {currentUser && (
                <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#2a2a2a',
                    borderRadius: '8px',
                    borderLeft: '4px solid #d4af37'
                }}>
                    <p style={{ fontSize: '14px', marginBottom: '5px', color: '#f5f5f5' }}>
                        <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                    </p>
                    <p style={{ fontSize: '12px', color: '#d4af37' }}>
                        {currentUser.role}
                    </p>
                </div>
            )}

            <ul className="sidebar-menu">
                {/* ADMIN ONLY SIDEBAR */}
                {isAdmin && (
                    <>
                        <li>
                            <Link
                                to="/admin/dashboard"
                                className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                            >
                                <span className="icon">📊</span>
                                <span className="title">Dashboard</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/bookings"
                                className={`sidebar-link ${location.pathname === '/admin/bookings' ? 'active' : ''}`}
                            >
                                <span className="icon">📋</span>
                                <span className="title">Booking Management</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/cars"
                                className={`sidebar-link ${location.pathname === '/admin/cars' ? 'active' : ''}`}
                            >
                                <span className="icon">🚗</span>
                                <span className="title">Manage Cars</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/locations"
                                className={`sidebar-link ${location.pathname === '/admin/locations' ? 'active' : ''}`}
                            >
                                <span className="icon">📍</span>
                                <span className="title">Locations</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/maintenance"
                                className={`sidebar-link ${location.pathname === '/admin/maintenance' ? 'active' : ''}`}
                            >
                                <span className="icon">🛠️</span>
                                <span className="title">Maintenance</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/insurance"
                                className={`sidebar-link ${location.pathname === '/admin/insurance' ? 'active' : ''}`}
                            >
                                <span className="icon">🛡️</span>
                                <span className="title">Insurance</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/users"
                                className={`sidebar-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
                            >
                                <span className="icon">👥</span>
                                <span className="title">User Management</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/support-list"
                                className={`sidebar-link ${location.pathname === '/support-list' ? 'active' : ''}`}
                            >
                                <span className="icon">👨‍💻</span>
                                <span className="title">Support Tickets</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/payments"
                                className={`sidebar-link ${location.pathname === '/admin/payments' ? 'active' : ''}`}
                            >
                                <span className="icon">💰</span>
                                <span className="title">Payment Management</span>
                            </Link>
                        </li>
                    </>
                )}

                {/* CAR OWNER SIDEBAR */}
                {isCarOwner && (
                    <>
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
                                to="/manage-cars"
                                className={`sidebar-link ${location.pathname === '/manage-cars' ? 'active' : ''}`}
                            >
                                <span className="icon">🚗</span>
                                <span className="title">Manage Cars</span>
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
                                to="/insurance"
                                className={`sidebar-link ${location.pathname === '/insurance' ? 'active' : ''}`}
                            >
                                <span className="icon">🛡️</span>
                                <span className="title">Insurance</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/bookings"
                                className={`sidebar-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                            >
                                <span className="icon">📋</span>
                                <span className="title">Bookings</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/support"
                                className={`sidebar-link ${location.pathname === '/support' ? 'active' : ''}`}
                            >
                                <span className="icon">👨‍💻</span>
                                <span className="title">Support</span>
                            </Link>
                        </li>
                    </>
                )}

                {/* CUSTOMER SIDEBAR */}
                {isCustomer && (
                    <>
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
                                to="/cars"
                                className={`sidebar-link ${location.pathname === '/cars' ? 'active' : ''}`}
                            >
                                <span className="icon">🚗</span>
                                <span className="title">Browse Cars</span>
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
                                to="/make-booking"
                                className={`sidebar-link ${location.pathname === '/make-booking' ? 'active' : ''}`}
                            >
                                <span className="icon">➕</span>
                                <span className="title">Make Booking</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/invoices"
                                className={`sidebar-link ${location.pathname === '/invoices' ? 'active' : ''}`}
                            >
                                <span className="icon">📋</span>
                                <span className="title">My Invoices</span>
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
                                <span className="title">Support</span>
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
                    </>
                )}

                {/* Logout - All Users */}
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