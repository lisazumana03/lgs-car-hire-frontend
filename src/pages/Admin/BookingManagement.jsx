import React, { useState, useEffect } from 'react';
import { adminApi } from '../../scripts/adminApi';
import './AdminManagement.css';

function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [editingBooking, setEditingBooking] = useState(null);
    const [editForm, setEditForm] = useState({
        startDate: '',
        endDate: '',
        bookingStatus: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const bookingsData = await adminApi.getAllBookings();
            setBookings(bookingsData);
        } catch (error) {
            setMessage('Error fetching bookings: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await adminApi.cancelBooking(bookingId);
                setMessage('Booking cancelled successfully');
                fetchBookings();
            } catch (error) {
                setMessage('Error cancelling booking: ' + error.message);
            }
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
            try {
                await adminApi.deleteBooking(bookingId);
                setMessage('Booking deleted successfully');
                fetchBookings();
                setDeleteConfirm(null);
            } catch (error) {
                setMessage('Error deleting booking: ' + error.message);
                setDeleteConfirm(null);
            }
        }
    };

    // const handleDeleteBooking = async (bookingId) => {
    //     const booking = bookings.find(b => b.bookingID === bookingId);
    //
    //     // Check if booking has payment
    //     if (booking?.payment) {
    //         setMessage('Cannot delete booking with payment history. Please cancel instead.');
    //         return;
    //     }
    //
    //     if (window.confirm('Are you sure you want to permanently delete this booking?')) {
    //         try {
    //             await adminApi.deleteBooking(bookingId);
    //             setMessage('Booking deleted successfully');
    //             fetchBookings();
    //         } catch (error) {
    //             setMessage('Error deleting booking: ' + error.message);
    //         }
    //     }
    // };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setEditForm({
            startDate: booking.startDate ? booking.startDate.split('T')[0] : '',
            endDate: booking.endDate ? booking.endDate.split('T')[0] : '',
            bookingStatus: booking.bookingStatus || 'PENDING'
        });
    };

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        try {
            // Use the DTO structure for update
            const updateData = {
                bookingID: editingBooking.bookingID,
                startDate: editForm.startDate ? `${editForm.startDate}T00:00:00` : null,
                endDate: editForm.endDate ? `${editForm.endDate}T00:00:00` : null,
                bookingStatus: editForm.bookingStatus
            };

            console.log('Sending update data:', updateData);

            await adminApi.updateBooking(updateData);
            setMessage('Booking updated successfully');
            setEditingBooking(null);
            fetchBookings();
        } catch (error) {
            console.error('Update error:', error);
            setMessage('Error updating booking: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-ZA');
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED':
            case 'ACTIVE':
            case 'BOOKED':
                return 'status-active';
            case 'COMPLETED':
                return 'status-completed';
            case 'CANCELLED':
            case 'DECLINED':
                return 'status-cancelled';
            case 'PENDING':
                return 'status-pending';
            default:
                return 'status-unknown';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        if (filter === 'active')
            return booking.bookingStatus === 'ACTIVE' ||
                booking.bookingStatus === 'CONFIRMED' ||
                booking.bookingStatus === 'BOOKED';
        if (filter === 'completed') return booking.bookingStatus === 'COMPLETED';
        if (filter === 'cancelled')
            return booking.bookingStatus === 'CANCELLED' ||
                booking.bookingStatus === 'DECLINED';
        if (filter === 'pending') return booking.bookingStatus === 'PENDING';
        return true;
    });

    const calculateStats = () => {
        const total = bookings.length;
        const active = bookings.filter(b =>
            b.bookingStatus === 'ACTIVE' ||
            b.bookingStatus === 'CONFIRMED' ||
            b.bookingStatus === 'BOOKED'
        ).length;
        const completed = bookings.filter(b => b.bookingStatus === 'COMPLETED').length;
        const cancelled = bookings.filter(b =>
            b.bookingStatus === 'CANCELLED' ||
            b.bookingStatus === 'DECLINED'
        ).length;
        const pending = bookings.filter(b => b.bookingStatus === 'PENDING').length;

        return { total, active, completed, cancelled, pending };
    };

    const stats = calculateStats();

    if (loading) {
        return <div className="loading">Loading bookings...</div>;
    }

    return (
        <div className="admin-management">
            <div className="admin-header">
                <h1>Booking Management</h1>
                <p>View and manage all system bookings</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {/* Statistics Cards */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '20px' }}>
                <div className="stat-card">
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <h3>{stats.active}</h3>
                        <p>Active</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <h3>{stats.completed}</h3>
                        <p>Completed</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
                <div className="filter-group">
                    <label>Filter by status:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Bookings</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="booking-stats">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </div>
            </div>

            <div className="management-content">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Customer</th>
                            <th>Car</th>
                            <th>Pickup Location</th>
                            <th>Drop-off Location</th>
                            <th>Period</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBookings.map(booking => (
                            <tr key={booking.bookingID}>
                                <td>#{booking.bookingID}</td>
                                <td>
                                    {booking.user ? (
                                        <div>
                                            <strong>{booking.user.firstName} {booking.user.lastName}</strong>
                                            <br />
                                            <small>{booking.user.email}</small>
                                            <br />
                                            <small>{booking.user.phoneNumber}</small>
                                        </div>
                                    ) : (
                                        'User not found'
                                    )}
                                </td>
                                <td>
                                    {booking.car ? (
                                        <div>
                                            <strong>{booking.car.brand} {booking.car.model}</strong>
                                            <br />
                                            <small>{booking.car.year} • {booking.car.carTypeName}</small>
                                            <br />
                                            <small>R{booking.car.rentalPrice}/day</small>
                                        </div>
                                    ) : (
                                        'Car not found'
                                    )}
                                </td>
                                <td>
                                    {booking.pickupLocation ? (
                                        <div>
                                            <strong>{booking.pickupLocation.locationName}</strong>
                                            <br />
                                            <small>{booking.pickupLocation.cityOrTown}</small>
                                        </div>
                                    ) : (
                                        'Not specified'
                                    )}
                                </td>
                                <td>
                                    {booking.dropOffLocation ? (
                                        <div>
                                            <strong>{booking.dropOffLocation.locationName}</strong>
                                            <br />
                                            <small>{booking.dropOffLocation.cityOrTown}</small>
                                        </div>
                                    ) : (
                                        'Not specified'
                                    )}
                                </td>
                                <td>
                                    <div>
                                        <strong>Start:</strong> {formatDate(booking.startDate)}
                                        <br />
                                        <strong>End:</strong> {formatDate(booking.endDate)}
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusColor(booking.bookingStatus)}`}>
                                        {booking.bookingStatus || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td>
                                    {formatDateTime(booking.bookingDateAndTime)}
                                </td>
                                <td className="actions">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <button
                                            onClick={() => handleEditBooking(booking)}
                                            className="btn-edit"
                                            style={{ fontSize: '0.8rem', padding: '5px 8px' }}
                                        >
                                            Edit
                                        </button>

                                        {(booking.bookingStatus === 'ACTIVE' ||
                                            booking.bookingStatus === 'CONFIRMED' ||
                                            booking.bookingStatus === 'BOOKED' ||
                                            booking.bookingStatus === 'PENDING') && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.bookingID)}
                                                className="btn-warning"
                                                style={{ fontSize: '0.8rem', padding: '5px 8px' }}
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {/* Only show delete button for bookings without payments */}
                                        {!booking.payment && (
                                            <button
                                                onClick={() => setDeleteConfirm(booking.bookingID)}
                                                className="btn-delete"
                                                style={{ fontSize: '0.8rem', padding: '5px 8px' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Booking Modal */}
            {editingBooking && (
                <div className="modal-overlay" onClick={() => setEditingBooking(null)}>
                    <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Booking #{editingBooking.bookingID}</h3>

                        <form onSubmit={handleUpdateBooking} className="edit-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date *</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="endDate">End Date *</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={editForm.endDate}
                                        onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bookingStatus">Status *</label>
                                <select
                                    id="bookingStatus"
                                    name="bookingStatus"
                                    value={editForm.bookingStatus}
                                    onChange={(e) => setEditForm({...editForm, bookingStatus: e.target.value})}
                                    className="form-input"
                                    required
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="BOOKED">Booked</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="DECLINED">Declined</option>
                                </select>
                            </div>

                            <div className="booking-info" style={{
                                backgroundColor: '#2a2a2a',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}>
                                <h4>Booking Information</h4>
                                <p><strong>Customer:</strong> {editingBooking.user?.firstName} {editingBooking.user?.lastName}</p>
                                <p><strong>Car:</strong> {editingBooking.car?.brand} {editingBooking.car?.model} ({editingBooking.car?.year})</p>
                                <p><strong>Daily Rate:</strong> R{editingBooking.car?.rentalPrice}/day</p>
                                <p><strong>Original Dates:</strong> {formatDate(editingBooking.startDate)} - {formatDate(editingBooking.endDate)}</p>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditingBooking(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to permanently delete this booking? This action cannot be undone and will remove all booking data from the system.</p>
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm-delete"
                                onClick={() => handleDeleteBooking(deleteConfirm)}
                            >
                                Delete Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingManagement;