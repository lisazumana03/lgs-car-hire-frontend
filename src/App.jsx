import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import LocationList from "./pages/Reservation/Location/LocationList.jsx";

function BookingHeader() {
    return (
        <header className="bg-red-900 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">Make Your Booking</h1>
        </header>
    );
}

function LocationViewHeader() {
    return (
        <header className="bg-red-900 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">View Available Renting Locations</h1>
        </header>
    );
}

function AppContent() {
    const location = useLocation();
    const isBookingPage = location.pathname === "/make-booking";
    const isLocationListPage = location.pathname === "/location-list";
    return (
        <>
            {isBookingPage ? <BookingHeader /> : <Header />}
            {isLocationListPage ? <LocationViewHeader /> : <Header />}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/make-booking" element={<BookingForm />} />
                    <Route path="/locations" element={<LocationList />} />
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
