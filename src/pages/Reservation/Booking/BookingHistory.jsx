/*
Lisakhanya Zumana (230864821)
Date: 13/08/2025
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings } from "../../../services/bookingService";
import "./BookingHistory.css"; // (Create this CSS file for custom styles)

function BookingHistory(){
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings();
            setBookings(response.data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setMessage("Error loading bookings");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        if (!status || typeof status !== "string") return 'text-gray-400 bg-gray-900/30';
        switch (status.toLowerCase()) {
            case 'confirmed': return 'text-green-400 bg-green-900/30';
            case 'pending': return 'text-yellow-400 bg-yellow-900/30';
            case 'cancelled': return 'text-red-400 bg-red-900/30';
            default: return 'text-gray-400 bg-gray-900/30';
        }
    };

    return(
        <div className="booking-history min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-center">Booking History</h2>
                <p className="text-xl text-center mb-8">Here you can view your bookings.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-center ${
                        messageType === 'success' 
                            ? 'bg-green-900/30 text-green-400 border border-green-500' 
                            : 'bg-red-900/30 text-red-400 border border-red-500'
                    }`}>
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-2">Loading bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400 mb-4">No bookings found</p>
                        <button
                            onClick={() => navigate("/make-booking")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Make Your First Booking
                        </button>
                    </div>
                ) : (
                    <div className="booking-cards-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div key={booking.bookingID || booking.id || booking.bookingId} className="booking-card bg-gray-800/50 rounded-lg p-6 border border-gray-700 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold">Booking #{booking.bookingID || booking.id || booking.bookingId}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                                        {booking.bookingStatus || 'Unknown'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm flex-1">
                                    <p>
                                        <span className="text-gray-400">Car:</span>{" "}
                                        {booking.cars && booking.cars.length > 0
                                            ? (typeof booking.cars[0] === "object"
                                                ? `${booking.cars[0].brand || ""} ${booking.cars[0].model || ""}`
                                                : booking.cars[0])
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <span className="text-gray-400">Booking Date:</span> {formatDate(booking.bookingDateAndTime)}
                                    </p>
                                    <p>
                                        <span className="text-gray-400">Start Date:</span> {formatDate(booking.startDate)}
                                    </p>
                                    <p>
                                        <span className="text-gray-400">End Date:</span> {formatDate(booking.endDate)}
                                    </p>
                                    <p>
                                        <span className="text-gray-400">Pickup:</span>{" "}
                                        {booking.pickupLocation
                                            ? (typeof booking.pickupLocation === "object"
                                                ? booking.pickupLocation.locationName
                                                : booking.pickupLocation)
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <span className="text-gray-400">Drop-off:</span>{" "}
                                        {booking.dropOffLocation
                                            ? (typeof booking.dropOffLocation === "object"
                                                ? booking.dropOffLocation.locationName
                                                : booking.dropOffLocation)
                                            : "N/A"}
                                    </p>
                                </div>
                                {/* Removed Edit, Delete, Cancel buttons */}
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-8">
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold mr-4"
                        onClick={() => navigate("/make-booking")}
                    >
                        Make New Booking
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 text-lg font-semibold"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookingHistory;

