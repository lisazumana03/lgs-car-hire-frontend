/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import {Link, useNavigate} from "react-router-dom";

export default function BookingComponent(){
    const navigate = useNavigate();
    return (
        <div className="booking-container">
            <h1>Booking Management</h1>
            <div className="booking-options">
                <div className="booking-card">
                    <h3>Choose Your Car</h3>
                    <p>Browse our premium fleet and select your perfect vehicle with detailed specifications.</p>
                    <Link
                        to="/select-car"
                        className="booking-btn primary"
                    >
                        Choose a Car
                    </Link>
                </div>
                
                <div className="booking-card">
                    <h3>Make a New Booking</h3>
                    <p>Create a new car rental booking with your preferred vehicle and dates.</p>
                    <Link
                        to="/make-booking"
                        className="booking-btn secondary"
                    >
                        Make Booking
                    </Link>
                </div>
                
                <div className="booking-card">
                    <h3>View Your Bookings</h3>
                    <p>Check your booking history and current reservations.</p>
                    <Link
                        to="/booking-history"
                        className="booking-btn tertiary"
                    >
                        View Booking History
                    </Link>
                </div>
                
                <div className="booking-card">
                    <h3>Manage All Bookings</h3>
                    <p>Admin view to manage all bookings in the system.</p>
                    <Link
                        to="/booking-list"
                        className="booking-btn tertiary"
                    >
                        Manage Bookings
                    </Link>
                </div>
            </div>
            <div>
            <h2 className="text-4xl font-bold text-white mb-8">Booking Options</h2>
            <div className="booking-links flex flex-col gap-6 mb-4 w-full max-w-md">
                <button
                    type="button"
                    className="submit-btn"
                    style={{ marginBottom: "10px", backgroundColor: "#ff0000" }}
                    onClick={() => navigate("/make-booking")}
                >
                    Make Booking
                </button>
                <button
                    type="button"
                    className="submit-btn"
                    style={{marginBottom: "10px", backgroundColor: "#ff0000"}}
                    onClick={() => navigate("/booking-history")}
                >
                    View Booking History
                </button>
            </div>
        </div>
        </div>
    );
}