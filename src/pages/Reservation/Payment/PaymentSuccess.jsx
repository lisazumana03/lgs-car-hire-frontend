/**
 * PaymentSuccess.jsx
 * Shows payment confirmation and allows navigation to booking details
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentForm.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const payment = location.state?.payment;
    const booking = location.state?.booking;

    if (!payment) {
        return (
            <div className="payment-container">
                <div className="payment-wrapper">
                    <h1 className="payment-title">Payment Information Not Found</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="submit-btn"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const bookingId = payment.bookingId || booking?.bookingID || booking?.id;

    return (
        <div className="payment-container">
            <div className="payment-wrapper">
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '12px',
                    border: '2px solid #22c55e',
                    marginBottom: '30px'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✓</div>
                    <h1 style={{ color: '#22c55e', marginBottom: '10px' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: '20px' }}>
                        Your payment has been processed successfully
                    </p>
                </div>

                <div className="booking-details" style={{ marginBottom: '30px' }}>
                    <h3>Payment Details</h3>
                    <div className="booking-info">
                        <p><strong>Reference:</strong> <span>{payment.reference}</span></p>
                        <p><strong>Amount:</strong> <span className="booking-amount">R{payment.amount}</span></p>
                        <p><strong>Booking ID:</strong> <span>#{bookingId}</span></p>
                        <p><strong>Payment Method:</strong> <span>{payment.paymentMethod}</span></p>
                        <p><strong>Status:</strong> <span style={{ color: '#22c55e' }}>{payment.status}</span></p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {bookingId && (
                        <button
                            onClick={() => navigate(`/booking-details/${bookingId}`)}
                            className="submit-btn"
                            style={{ backgroundColor: '#007bff', padding: '15px 30px', fontSize: '1.1rem' }}
                        >
                            View Booking Details
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="submit-btn"
                        style={{ backgroundColor: '#6c757d', padding: '15px 30px', fontSize: '1.1rem' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;