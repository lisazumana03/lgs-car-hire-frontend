/**
 * Sanele Zondi (221602011)
 * PaymentConfirmation.jsx (file)
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { payment, booking } = location.state || {};

    if (!payment || !booking) {
        return (
            <div className="form">
                <div className="message error">No payment information found.</div>
                <button
                    className="submit-btn"
                    onClick={() => navigate('/bookings')}
                    style={{marginTop: '20px'}}
                >
                    Go to Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="form">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                    fontSize: '48px',
                    color: '#28a745',
                    marginBottom: '20px'
                }}>✓</div>
                <h1>Payment Successful!</h1>
                <p style={{ color: '#fff', marginTop: '10px' }}>
                    Your payment has been processed successfully.
                </p>
            </div>

            <div style={{
                backgroundColor: '#3a3a3a',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '25px'
            }}>
                <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Payment Details</h3>

                <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaa' }}>Payment ID:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{payment.paymentID}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaa' }}>Amount:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>R{payment.amount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaa' }}>Payment Method:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{payment.paymentMethod}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaa' }}>Booking Reference:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>
                        #{booking.bookingID || booking.id}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaa' }}>Date:</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                    className="submit-btn"
                    onClick={() => navigate(`/invoice/${payment.paymentID}`)}
                >
                    View Invoice
                </button>
                <button
                    className="submit-btn"
                    onClick={() => navigate('/dashboard')}
                    style={{ backgroundColor: '#6c757d' }}
                >
                    Back to Dashboard
                </button>
                <button
                    className="submit-btn"
                    onClick={() => navigate('/invoices')}
                    style={{ backgroundColor: '#28a745' }}
                >
                    View All Invoices
                </button>
            </div>
        </div>
    );
};

export default PaymentConfirmation;