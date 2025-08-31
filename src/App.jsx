import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";
import BookingList from "./pages/Reservation/Booking/BookingList.jsx";
import LocationForm from "./pages/Reservation/Location/LocationForm.jsx";
import BookingHistory from "./pages/Reservation/Booking/BookingHistory.jsx"

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
    )
}

function AppContent() {
    const location = useLocation();
    const isBookingPage = location.pathname === "/make-booking";
    const isLocationListPage = location.pathname === "/locations";
    const isHomePage = location.pathname === "/";
    const isBookingListPage = location.pathname === "/bookings";
    const isBookingHistoryPage = location.pathname === "/booking-history";
    const isLocationPage = location.pathname === "/register-location";

    return (
        <>
            {isBookingPage ? (
                <BookingHeader />
            ) : isLocationListPage ? (
                <LocationViewHeader />
            ) : isBookingListPage ? (
                <BookingListHeader />
            ) : isLocationPage ? (
                <LocationHeader />
            ) : isBookingHistoryPage ? (
                <BookingHistoryHeader />
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
                    <Route path="/cars"/>
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
