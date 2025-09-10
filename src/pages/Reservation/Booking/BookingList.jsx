/*
Lisakhanya Zumana (230864821)
Date: 13/08/2025
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings, deleteBooking, cancel, update } from "../../../services/bookingService";

function BookingList() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await deleteBooking(id);
                setMessage("Booking deleted successfully");
                setMessageType("success");
                fetchBookings();
            } catch (error) {
                console.error("Error deleting booking:", error);
                setMessage("Error deleting booking");
                setMessageType("error");
            }
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await cancel(id);
                setMessage("Booking cancelled successfully");
                setMessageType("success");
                fetchBookings();
            } catch (error) {
                console.error("Error cancelling booking:", error);
                setMessage("Error cancelling booking");
                setMessageType("error");
            }
        }
    };

    const handleEdit = (booking) => {
        setEditingId(booking.id || booking.bookingId);
        setEditForm({
            cars: booking.cars || [""],
            bookingDateAndTime: booking.bookingDateAndTime || "",
            startDate: booking.startDate || "",
            endDate: booking.endDate || "",
            pickupLocation: booking.pickupLocation || "",
            dropOffLocation: booking.dropOffLocation || "",
            bookingStatus: booking.bookingStatus || "pending"
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === "cars") {
            setEditForm(prev => ({ ...prev, cars: [value] }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await update({ ...editForm, id: editingId });
            setMessage("Booking updated successfully");
            setMessageType("success");
            setEditingId(null);
            setEditForm({});
            fetchBookings();
        } catch (error) {
            console.error("Error updating booking:", error);
            setMessage("Error updating booking");
            setMessageType("error");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'text-green-400 bg-green-900/30';
            case 'pending': return 'text-yellow-400 bg-yellow-900/30';
            case 'cancelled': return 'text-red-400 bg-red-900/30';
            default: return 'text-gray-400 bg-gray-900/30';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-center">All Bookings</h2>
                <p className="text-xl text-center mb-8">Manage all bookings in the system.</p>
                
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
                        <p className="text-xl text-gray-400">No bookings found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id || booking.bookingId} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                {editingId === (booking.id || booking.bookingId) ? (
                                    <form onSubmit={handleEditSubmit} className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Edit Booking #{booking.id || booking.bookingId}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Car</label>
                                                <input
                                                    type="text"
                                                    name="cars"
                                                    value={editForm.cars?.[0] || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Status</label>
                                                <select
                                                    name="bookingStatus"
                                                    value={editForm.bookingStatus || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Pickup Location</label>
                                                <input
                                                    type="text"
                                                    name="pickupLocation"
                                                    value={editForm.pickupLocation || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Drop-off Location</label>
                                                <input
                                                    type="text"
                                                    name="dropOffLocation"
                                                    value={editForm.dropOffLocation || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                                Save Changes
                                            </button>
                                            <button type="button" onClick={handleCancelEdit} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold">Booking #{booking.id || booking.bookingId}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                                                {booking.bookingStatus || 'Unknown'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                            <p><span className="text-gray-400">Car:</span> {booking.cars?.[0] || 'N/A'}</p>
                                            <p><span className="text-gray-400">Booking Date:</span> {formatDate(booking.bookingDateAndTime)}</p>
                                            <p><span className="text-gray-400">Start Date:</span> {formatDate(booking.startDate)}</p>
                                            <p><span className="text-gray-400">End Date:</span> {formatDate(booking.endDate)}</p>
                                            <p><span className="text-gray-400">Pickup:</span> {booking.pickupLocation || 'N/A'}</p>
                                            <p><span className="text-gray-400">Drop-off:</span> {booking.dropOffLocation || 'N/A'}</p>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleEdit(booking)}
                                                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            {booking.bookingStatus?.toLowerCase() !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleCancel(booking.id || booking.bookingId)}
                                                    className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(booking.id || booking.bookingId)}
                                                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-8">
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
    );
}

export default BookingList;