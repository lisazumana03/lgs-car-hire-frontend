import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx";
import CarForm from "./pages/Reservation/Vehicle/CarForm.jsx";
import CarList from "./pages/Reservation/Vehicle/CarList.jsx";

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
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW YOUR BOOKING HISTORY</h1>
        </header>
    );
}

function LocationHeader() {
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">REGISTER A NEW RENTING LOCATION</h1>
        </header>
    );
}

function LocationViewHeader() {
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW AVAILABLE RENTING LOCATIONS</h1>
        </header>
    );
}

function BookingListHeader() {
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">VIEW YOUR BOOKINGS</h1>
        </header>
    );
}

function CarHeader() {
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">REGISTER A NEW CAR</h1>
        </header>
    );
}

function CarListHeader() {
    return (
        <header className="bg-red-600 text-white p-6 flex justify-center items-center">
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
                </Routes>
            </main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;