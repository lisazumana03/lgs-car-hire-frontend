
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import Footer from "./pages/Common/Footer.jsx";
import Header from "./pages/Common/Header.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import LocationPicker from "./pages/Reservation/Location/LocationPicker.jsx";

function BookingHeader() {
    return (
        <header className="bg-blue-900 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">Make Your Booking</h1>
        </header>
    );
}

function LocationHeader() {
    return (
        <header className="bg-blue-900 text-white p-6 flex justify-center items-center">
            <h1 className="text-2xl font-bold">View Locations</h1>
        </header>
    );
}

function AppContent() {
    const location = useLocation();
    // Show a different header for the booking page
    const isBookingPage = location.pathname === "/make-booking";
    return (
        <>
            {isBookingPage ? <BookingHeader /> : <Header />}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/make-booking" element={<BookingForm />} />
                    <Route path="/available-locations" element={<LocationPicker />} />
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
