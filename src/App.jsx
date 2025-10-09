import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './index.css';

// Hooks
import { useAuth } from './hooks';

// Components
import { AppSidebar, Header, Footer } from './components/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminDashboard from './pages/Authentication/AdminDashboard';
import Dashboard from './pages/Users/Dashboard';
import LoginForm from './pages/Users/LoginForm';
import RegistrationForm from './pages/Users/RegistrationForm';
import UserProfile from './pages/Users/UserProfile';
import BookingComponent from './pages/Reservation/Booking/BookingComponent';
import BookingForm from './pages/Reservation/Booking/BookingForm';
import BookingHistory from './pages/Reservation/Booking/BookingHistory';
import BookingList from './pages/Reservation/Booking/BookingList';
import CarSelection from './pages/Reservation/Booking/CarSelection';
import LocationForm from './pages/Reservation/Location/LocationForm';
import LocationList from './pages/Reservation/Location/LocationList';
import LocationSelector from './pages/Reservation/Location/LocationSelector';
import CarForm from './pages/Vehicle/CarForm';
import CarList from './pages/Vehicle/CarList';

// Constants
import { ROUTES } from './constants';

function App() {
  const { authenticated, currentUser, handleLogin, handleLogout } = useAuth();

  return (
    <Router>
      <div className={`app ${authenticated ? 'authenticated' : 'unauthenticated'}`}>
        {authenticated ? (
          <>
            <AppSidebar onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard user={currentUser} />} />
                <Route path={ROUTES.PROFILE} element={<UserProfile user={currentUser} />} />
                <Route path={ROUTES.BOOKINGS} element={<BookingComponent />} />
                <Route path={ROUTES.MAKE_BOOKING} element={<BookingForm user={currentUser} />} />
                <Route path={ROUTES.BOOKING_HISTORY} element={<BookingHistory />} />
                <Route path={ROUTES.BOOKING_LIST} element={<BookingList />} />
                <Route path={ROUTES.CARS} element={<CarList />} />
                <Route path={ROUTES.REGISTER_CAR} element={<CarForm />} />
                <Route path={ROUTES.SELECT_CAR} element={<CarSelection />} />
                <Route path={ROUTES.LOCATIONS} element={<LocationList />} />
                <Route path={ROUTES.CHOOSE_LOCATION} element={<LocationSelector />} />
                <Route path={ROUTES.REGISTER_LOCATION} element={<LocationForm />} />
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              </Routes>
            </main>
          </>
        ) : (
          <>
            <Header />
            <main className="main-content">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
                <Route path={ROUTES.LOGIN} element={<LoginForm onLogin={handleLogin} />} />
                <Route path={ROUTES.REGISTER} element={<RegistrationForm />} />
                <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />

                {/* Protected routes - redirect to login if accessed without authentication */}
                <Route path={ROUTES.CARS} element={<ProtectedRoute><CarList /></ProtectedRoute>} />
                <Route path={ROUTES.LOCATIONS} element={<ProtectedRoute><LocationList /></ProtectedRoute>} />
                <Route path={ROUTES.BOOKINGS} element={<ProtectedRoute><BookingComponent /></ProtectedRoute>} />
                <Route path={ROUTES.MAKE_BOOKING} element={<ProtectedRoute><BookingForm user={currentUser} /></ProtectedRoute>} />
                <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard user={currentUser} /></ProtectedRoute>} />
                <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfile user={currentUser} /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;