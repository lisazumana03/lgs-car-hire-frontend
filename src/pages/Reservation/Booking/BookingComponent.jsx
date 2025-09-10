/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import { Link } from "react-router-dom";

export default function BookingComponent(){
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
        </div>
    );
}