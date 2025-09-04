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
                    type="button"
                    className="make-booking-btn"
                    onClick={() => navigate("/make-booking")}
                >
                    Make Booking
                </button>
                <button
                    type="button"
                    className="submit-btn"
                    onClick={() => navigate("/booking-history")}
                >
                    View Booking History
                </button>
            </div>
        </div>
    );
}