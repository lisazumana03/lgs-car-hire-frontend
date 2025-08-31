/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import { Link, Route, Routes } from "react-router-dom";
import BookingForm from "./BookingForm";
import BookingHistory from "./BookingHistory";

function BookingCreation(){
    return(
        <div>
            <p> Where we create a new form. </p>
        </div>
    )
}

export default function BookingComponent(){
    return (
        <div>
            <h2 className="text-center">Booking Options</h2>
            <div className="booking-links flex gap-4 mb-4">
                <Link
                    to="/make-booking"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
                >
                    Make Booking
                </Link>
                <Link
                    to="/booking-history"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800"
                >
                    View Booking History
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