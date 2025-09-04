/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import { useNavigate } from "react-router-dom";

export default function BookingComponent(){
    const navigate = useNavigate();
    return (
        <div>
            <h2 className="text-4xl font-bold text-white mb-8">Booking Options</h2>
            <div className="booking-links flex flex-col gap-6 mb-4 w-full max-w-md">
                <button
                    onClick={() => navigate("/make-booking")}
                >
                    Make Booking
                </button>
                <button
                    onClick={() => navigate("/booking-history")}
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    View Booking History
                </button>
            </div>
        </div>
    );
}