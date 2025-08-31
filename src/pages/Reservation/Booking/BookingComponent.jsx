/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import { Link, Route, Routes } from "react-router-dom";
import BookingForm from "./BookingForm";
import BookingHistory from "./BookingHistory";

function bookingCreation(){
    return(
        <div>
            <p> Where we create a new form. </p>
        </div>
    )
}

export default function BookingComponent(){
    return (
        <div>
            <h2>Bookings</h2>
            <div className="booking-links flex gap-4 mb-4">
                <Link
                    to="create"
                    className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-800"
                >
                    Create Booking
                </Link>
                <Link
                    to="history"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                >
                    Booking History
                </Link>
            </div>

            <Routes>
                <Route path="/make-booking" element={<BookingForm />} />
                <Route path="/booking-history" element={<BookingHistory />} />
                <Route path="/" element={<div>Select an option above to manage bookings.</div>} />
            </Routes>
        </div>
    );
}