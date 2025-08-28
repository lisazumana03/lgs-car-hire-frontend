/*
Lisakhanya Zumana (230864821)
Date: 13/08/2025
 */
import { useNavigate } from "react-router-dom";

function BookingList() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => navigate("/")}>Back</button>
        </div>
    );
}
export default BookingList;