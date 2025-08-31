/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import paymentService from '../../../services/paymentService';

const PaymentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state?.booking;

    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');

    if (!booking) {
        return (
            <div className="form">
                <div className="message error">No booking information found. Please start from booking page.</div>
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setMessage('');

        try {
            const paymentData = {
                booking: { bookingID: booking.bookingID },
                amount: booking.totalAmount || 500,
                paymentMethod: paymentMethod
            };

            const paymentResult = await paymentService.create(paymentData);

            navigate('/payment/confirmation', {
                state: {
                    payment: paymentResult,
                    booking: booking
                }
            });
        } catch (error) {
            console.error('Payment failed:', error);
            setMessage('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="form">
            <h1>Payment for Booking #{booking.bookingID}</h1>

            <div style={{
                backgroundColor: '#3a3a3a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <p style={{ margin: '5px 0', color: '#fff' }}>
                    <strong>Amount:</strong> R{booking.totalAmount || 500}
                </p>
                <p style={{ margin: '5px 0', color: '#fff' }}>
                    <strong>Car:</strong> {booking.cars?.[0]?.model || 'Car'}
                </p>
                <p style={{ margin: '5px 0', color: '#fff' }}>
                    <strong>Duration:</strong> {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Start'} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'End'}
                </p>
            </div>

            {message && (
                <div className={`message ${message.includes('failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-input"
                    >
                        <option value="creditCard">Credit Card</option>
                        <option value="debitCard">Debit Card</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                {(paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (
                    <>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                                id="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardDetails.cardNumber}
                                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                                className="form-input"
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="expiryDate">Expiry Date</label>
                                <input
                                    id="expiryDate"
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiryDate}
                                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    id="cvv"
                                    type="text"
                                    placeholder="123"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cardHolder">Card Holder Name</label>
                            <input
                                id="cardHolder"
                                type="text"
                                placeholder="John Doe"
                                value={cardDetails.cardHolder}
                                onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                                className="form-input"
                                required
                            />
                        </div>
                    </>
                )}

                {paymentMethod === 'cash' && (
                    <div style={{
                        backgroundColor: '#4a5568',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ color: '#fff', textAlign: 'center' }}>
                            Please bring cash payment when you pick up your vehicle.
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/bookings')}
                        className="submit-btn"
                        style={{ backgroundColor: '#6c757d' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="submit-btn"
                    >
                        {isProcessing ? 'Processing...' : `Pay R${booking.totalAmount || 500}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;