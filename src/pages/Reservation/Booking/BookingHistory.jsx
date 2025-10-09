/*
Lisakhanya Zumana (230864821)
Date: 13/08/2025
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings, deleteBooking, cancel } from "../../../services/bookingService";
import { getUserData } from "../../../services/authService";
import "./BookingHistory.css";

function BookingHistory(){
    const navigate = useNavigate();
    const userData = getUserData();
    const isAdmin = userData?.role?.toLowerCase() === 'admin';
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    };

    const isBookingDatePassed = (booking) => {
        if (!booking.startDate) return false;
        const bookingDate = new Date(booking.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return bookingDate < today;
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = statusFilter === "all" || booking.bookingStatus?.toLowerCase() === statusFilter.toLowerCase();

        const carInfo = booking.cars?.[0];
        const carName = typeof carInfo === 'object'
            ? `${carInfo.brand || ''} ${carInfo.model || ''}`.trim()
            : carInfo || '';

        const matchesSearch = searchTerm === "" ||
            carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.dropOffLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.id || booking.bookingId)?.toString().includes(searchTerm);

        return matchesStatus && matchesSearch;
    });

    return(
        <div className="booking-history-container">
            <div className="booking-history-wrapper">
                <div className="booking-history-header">
                    <h2 className="booking-history-title">Booking History</h2>
                    <p className="booking-history-subtitle">View and manage your car rental bookings</p>
                </div>

                {message && (
                    <div className={`alert-message ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            {messageType === 'success' ? (
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            ) : (
                                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            )}
                        </svg>
                        {message}
                    </div>
                )}

                <div className="filter-bar">
                    <div className="search-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by car, location, or booking ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="clear-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="filter-group">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V17L10 21V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="results-count">
                        {filteredBookings.length} {filteredBookings.length === 1 ? 'result' : 'results'}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Loading bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="empty-state">
                        <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="empty-state-text">No bookings found</p>
                        <p className="empty-state-subtext">Start your journey by making your first booking</p>
                        <button onClick={() => navigate("/make-booking")} className="btn-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Make Your First Booking
                        </button>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {filteredBookings.map((booking, index) => (
                            <div key={booking.id || booking.bookingId || index} className="booking-card">
                                <div className="booking-card-header">
                                    <h3 className="booking-id">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        #{booking.id || booking.bookingId}
                                    </h3>
                                    <span className={`status-badge ${getStatusClass(booking.bookingStatus)}`}>
                                        {booking.bookingStatus || 'Unknown'}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <div className="booking-detail-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H9L11 8H20C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <div>
                                            <span className="detail-label">Car: </span>
                                            <span className="detail-value">
                                                {booking.cars?.[0]
                                                    ? typeof booking.cars[0] === 'object'
                                                        ? `${booking.cars[0].brand || ''} ${booking.cars[0].model || ''}`.trim() || 'N/A'
                                                        : booking.cars[0]
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="booking-detail-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="detail-label">Booked: </span>
                                            <span className="detail-value">{formatDate(booking.bookingDateAndTime)}</span>
                                        </div>
                                    </div>

                                    <div className="booking-detail-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="detail-label">Start: </span>
                                            <span className="detail-value">{formatDate(booking.startDate)}</span>
                                        </div>
                                    </div>

                                    <div className="booking-detail-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="detail-label">End: </span>
                                            <span className="detail-value">{formatDate(booking.endDate)}</span>
                                        </div>
                                    </div>

                                    <div className="booking-detail-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="detail-label">Pickup: </span>
                                            <span className="detail-value">{booking.pickupLocation || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="booking-detail-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="detail-label">Drop-off: </span>
                                            <span className="detail-value">{booking.dropOffLocation || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    {booking.bookingStatus?.toLowerCase() !== 'cancelled' && !isBookingDatePassed(booking) && (
                                        <button onClick={() => handleCancel(booking.id || booking.bookingId)} className="btn-cancel">
                                            Cancel
                                        </button>
                                    )}
                                    {isAdmin && (
                                        <button onClick={() => handleDelete(booking.id || booking.bookingId)} className="btn-delete">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bottom-actions">
                    <button onClick={() => navigate("/make-booking")} className="btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Make New Booking
                    </button>
                    <button onClick={() => navigate("/dashboard")} className="btn-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookingHistory;
