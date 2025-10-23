import React, { useState, useEffect } from 'react';
import { adminApi } from '../../scripts/adminApi';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCars: 0,
        availableCars: 0,
        totalBookings: 0,
        activeBookings: 0,
        totalPayments: 0,
        totalRevenue: 0,
        pendingMaintenance: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all data in parallel
            const [users, cars, bookings, payments, maintenance] = await Promise.all([
                adminApi.getAllUsers(),
                adminApi.getAllCars(),
                adminApi.getAllBookings(),
                adminApi.getAllPayments(),
                adminApi.getAllMaintenance()
            ]);

            // Calculate statistics
            const availableCars = cars.filter(car => car.availability).length;
            const activeBookings = bookings.filter(booking =>
                booking.bookingStatus === 'ACTIVE' || booking.bookingStatus === 'CONFIRMED'
            ).length;

            const paidPayments = payments.filter(p => p.paymentStatus === 'PAID');
            const totalRevenue = paidPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
            const pendingMaintenance = maintenance.filter(m => m.status === 'PENDING').length;

            setStats({
                totalUsers: users.length,
                totalCars: cars.length,
                availableCars: availableCars,
                totalBookings: bookings.length,
                activeBookings: activeBookings,
                totalPayments: payments.length,
                totalRevenue: totalRevenue,
                pendingMaintenance: pendingMaintenance
            });

            // Get recent activity (last 5 items)
            setRecentBookings(bookings.slice(0, 5));
            setRecentPayments(paidPayments.slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
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
            case 'ACTIVE':
            case 'CONFIRMED':
            case 'PAID': return 'status-active';
            case 'COMPLETED': return 'status-completed';
            case 'CANCELLED':
            case 'FAILED': return 'status-cancelled';
            case 'PENDING': return 'status-pending';
            default: return 'status-unknown';
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading">Loading dashboard data...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>System Overview and Analytics</p>
            </div>

            {/* Main Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                    <Link to="/admin/users" className="stat-link">View All</Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🚗</div>
                    <div className="stat-info">
                        <h3>{stats.totalCars}</h3>
                        <p>Total Cars</p>
                        <small>{stats.availableCars} available</small>
                    </div>
                    <Link to="/admin/cars" className="stat-link">Manage</Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>{stats.totalBookings}</h3>
                        <p>Total Bookings</p>
                        <small>{stats.activeBookings} active</small>
                    </div>
                    <Link to="/admin/bookings" className="stat-link">View All</Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>{formatCurrency(stats.totalRevenue)}</h3>
                        <p>Total Revenue</p>
                        <small>{stats.totalPayments} payments</small>
                    </div>
                    <Link to="/admin/payments" className="stat-link">View Payments</Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2>Quick Access</h2>
                <div className="action-buttons">
                    <Link to="/admin/users" className="action-btn">
                        <span className="action-icon">👥</span>
                        <span className="action-title">Manage Users</span>
                        <span className="action-desc">View and manage system users</span>
                    </Link>

                    <Link to="/admin/cars" className="action-btn">
                        <span className="action-icon">🚗</span>
                        <span className="action-title">Manage Cars</span>
                        <span className="action-desc">View and manage vehicles</span>
                    </Link>

                    <Link to="/admin/bookings" className="action-btn">
                        <span className="action-icon">📋</span>
                        <span className="action-title">View Bookings</span>
                        <span className="action-desc">See all system bookings</span>
                    </Link>

                    <Link to="/admin/locations" className="action-btn">
                        <span className="action-icon">📍</span>
                        <span className="action-title">Manage Locations</span>
                        <span className="action-desc">Pickup and drop-off points</span>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-grid">
                {/* Recent Bookings */}
                <div className="recent-section">
                    <div className="section-header">
                        <h3>Recent Bookings</h3>
                        <Link to="/admin/bookings" className="view-all">View All</Link>
                    </div>
                    <div className="recent-list">
                        {recentBookings.map(booking => (
                            <div key={booking.bookingID} className="recent-item">
                                <div className="item-avatar">B</div>
                                <div className="item-info">
                                    <strong>Booking #{booking.bookingID}</strong>
                                    <span>
                                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                    </span>
                                </div>
                                <div className="item-meta">
                                    <span className={`status-badge ${getStatusColor(booking.bookingStatus)}`}>
                                        {booking.bookingStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="recent-section">
                    <div className="section-header">
                        <h3>Recent Payments</h3>
                        <Link to="/admin/payments" className="view-all">View All</Link>
                    </div>
                    <div className="recent-list">
                        {recentPayments.map(payment => (
                            <div key={payment.paymentID} className="recent-item">
                                <div className="item-avatar">P</div>
                                <div className="item-info">
                                    <strong>Payment #{payment.paymentID}</strong>
                                    <span>{formatCurrency(payment.amount)}</span>
                                </div>
                                <div className="item-meta">
                                    <span className={`status-badge ${getStatusColor(payment.paymentStatus)}`}>
                                        {payment.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;