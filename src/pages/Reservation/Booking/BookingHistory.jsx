/*
Lisakhanya Zumana (230864821)
Date: 13/08/2025
 */
import { useNavigate } from "react-router-dom";

function BookingHistory(){
    const navigate = useNavigate();

    return(
        <div className="booking-history min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Booking History</h2>
            <p className="text-xl text-center mb-8">Here you can view your past bookings.</p>
            {/* Booking history content will go here */}
            <div className="text-center">
                <button
                    type="button"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
                    onClick={() => navigate("/bookings")}
                >
                    Back to Bookings
                </button>
            </div>
        </div>
    )
}

export default BookingHistory;