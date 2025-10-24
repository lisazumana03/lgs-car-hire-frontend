import React, { useState, useEffect } from 'react';
import { adminApi } from '../../scripts/adminApi';
import './AdminManagement.css';

function PaymentsManagement() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [dataSource, setDataSource] = useState(''); // Track where data comes from

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        setMessage('');
        
        
        try {
            const paymentsData = await adminApi.getAllPayments();

            if (paymentsData && Array.isArray(paymentsData)) {
                setPayments(paymentsData);
                setDataSource('backend');
            } else {
                throw new Error('Invalid data format received from server');
            }
        } catch (error) {
            setMessage(`Error: Unable to load payments data. ${error.message}`);
            setPayments([]);
            setDataSource('error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (paymentId, newStatus) => {
        try {
            await adminApi.updatePaymentStatus(paymentId, newStatus);
            setMessage(`Payment status updated to ${newStatus}`);
            fetchPayments();
        } catch (error) {
            setMessage('Error updating payment status: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID': return 'status-completed';
            case 'PENDING': return 'status-pending';
            case 'FAILED': return 'status-cancelled';
            case 'REFUNDED': return 'status-unknown';
            default: return 'status-unknown';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID': return 'PAID';
            case 'PENDING': return 'PENDING';
            case 'FAILED': return 'FAILED';
            case 'REFUNDED': return 'REFUNDED';
            default: return status || 'UNKNOWN';
        }
    };

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.paymentStatus === filter.toUpperCase();
    });

    // Calculate financial stats
    const totalRevenue = payments
        .filter(p => p.paymentStatus === 'PAID')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const successfulPayments = payments.filter(p => p.paymentStatus === 'PAID').length;
    const pendingPayments = payments.filter(p => p.paymentStatus === 'PENDING').length;
    const failedPayments = payments.filter(p => p.paymentStatus === 'FAILED').length;

    if (loading) {
        return (
            <div className="admin-management">
                <div className="loading">Loading payments data from server...</div>
            </div>
        );
    }

    return (
        <div className="admin-management">
            <div className="admin-header">
                <h1>Payments Management</h1>
                <p>Manage and monitor all payment transactions</p>
                <button
                    onClick={fetchPayments}
                    className="btn-refresh"
                    style={{marginTop: '10px', padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                >
                    Refresh Data
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') || message.includes('Unable') ? 'error' : 'success'}`}>
                    {message}
                    {dataSource === 'backend' && payments.length > 0 && (
                        <div style={{fontSize: '0.9em', marginTop: '5px'}}>
                            Data loaded from backend server
                        </div>
                    )}
                </div>
            )}

            {/* Financial Overview Cards */}
            {payments.length > 0 && (
                <div className="stats-grid" style={{ marginBottom: '30px' }}>
                    <div className="stat-card">
                        <div className="stat-icon">R</div>
                        <div className="stat-info">
                            <h3>{formatCurrency(totalRevenue)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">S</div>
                        <div className="stat-info">
                            <h3>{successfulPayments}</h3>
                            <p>Successful Payments</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">P</div>
                        <div className="stat-info">
                            <h3>{pendingPayments}</h3>
                            <p>Pending Payments</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">F</div>
                        <div className="stat-info">
                            <h3>{failedPayments}</h3>
                            <p>Failed Payments</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Controls */}
            <div className="filter-controls">
                <div className="filter-group">
                    <label>Filter by status:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
                <div className="payment-stats">
                    <span>Displaying: {filteredPayments.length} of {payments.length} payments</span>
                </div>
            </div>

            <div className="management-content">
                {payments.length > 0 ? (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Booking ID</th>
                                {/*<th>Customer</th>*/}
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment.paymentID}>
                                    <td>#{payment.paymentID}</td>
                                    <td>
                                        {payment.booking ?
                                            `#${payment.booking.bookingID}` :
                                            'N/A'}
                                    </td>
                                    {/*<td>*/}
                                    {/*    {payment.booking?.user ?*/}
                                    {/*        `${payment.booking.user.firstName} ${payment.booking.user.lastName}` :*/}
                                    {/*        'Customer not found'}*/}
                                    {/*</td>*/}
                                    <td>
                                        <strong>{formatCurrency(payment.amount)}</strong>
                                    </td>
                                    <td>
                                            <span className="payment-method">
                                                {payment.paymentMethod || 'N/A'}
                                            </span>
                                    </td>
                                    <td>
                                            <span className={`status-badge ${getStatusColor(payment.paymentStatus)}`}>
                                                {getStatusText(payment.paymentStatus)}
                                            </span>
                                    </td>
                                    <td className="actions">
                                        {payment.paymentStatus !== 'PAID' && (
                                            <button
                                                onClick={() => handleUpdateStatus(payment.paymentID, 'PAID')}
                                                className="btn-success"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        {payment.paymentStatus !== 'FAILED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(payment.paymentID, 'FAILED')}
                                                className="btn-warning"
                                            >
                                                Mark Failed
                                            </button>
                                        )}
                                        {payment.paymentStatus === 'PAID' && (
                                            <button
                                                onClick={() => handleUpdateStatus(payment.paymentID, 'REFUNDED')}
                                                className="btn-info"
                                            >
                                                Process Refund
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-results">
                        <p className="no-results-text">No payment records found</p>
                        <p className="no-results-subtext">
                            {dataSource === 'error'
                                ? 'There was an error loading payments data from the server.'
                                : 'There are no payment records in the system yet.'
                            }
                        </p>
                        <button
                            onClick={fetchPayments}
                            className="btn-refresh"
                            style={{marginTop: '15px', padding: '10px 20px'}}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {payments.length > 0 && filteredPayments.length === 0 && (
                    <div className="no-results">
                        <p className="no-results-text">No payments match your filter criteria</p>
                        <p className="no-results-subtext">Try adjusting your filter settings</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentsManagement;