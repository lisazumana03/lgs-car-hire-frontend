/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import { Link } from "react-router-dom";

export default function BookingComponent(){
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-8">Booking Options</h2>
            <div className="booking-links flex flex-col gap-6 mb-4 w-full max-w-md">
                <Link
                    to="/make-booking"
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    Make Booking
                </Link>
                <Link
                    to="/booking-history"
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    View Booking History
                </Link>
            </div>
        </div>
    );
}