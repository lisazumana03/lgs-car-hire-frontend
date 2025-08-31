/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import paymentService from '../../../services/paymentService';
import { getAllBookings } from '../../../services/bookingService'; // Import booking service

const PaymentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingFromState = location.state?.booking;

    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(bookingFromState || null);
    const [loading, setLoading] = useState(!bookingFromState);

    // Fetch bookings if no booking was passed via state
    useEffect(() => {
        if (!bookingFromState) {
            fetchBookings();
        }
    }, [bookingFromState]);

    const fetchBookings = async () => {
        try {
            const response = await getAllBookings();
            setBookings(response.data || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            setMessage('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="form">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if (!selectedBooking && bookings.length === 0) {
        return (
            <div className="form">
                <div className="message error">No bookings found. Please create a booking first.</div>
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

        if (!selectedBooking) {
            setMessage('Please select a booking to pay for');
            return;
        }

        setIsProcessing(true);
        setMessage('');

        try {
            const paymentData = {
                booking: { bookingID: selectedBooking.bookingID || selectedBooking.id },
                amount: selectedBooking.totalAmount || 500,
                paymentMethod: paymentMethod
            };

            const paymentResult = await paymentService.create(paymentData);

            navigate('/payment/confirmation', {
                state: {
                    payment: paymentResult,
                    booking: selectedBooking
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
            <h1>Make Payment</h1>

            {/* Booking selection (only show if no booking was passed) */}
            {!bookingFromState && (
                <div className="form-group">
                    <label htmlFor="bookingSelect">Select Booking to Pay</label>
                    <select
                        id="bookingSelect"
                        value={selectedBooking?.id || ''}
                        onChange={(e) => {
                            const bookingId = e.target.value;
                            const booking = bookings.find(b => b.id === bookingId || b.bookingID === bookingId);
                            setSelectedBooking(booking);
                        }}
                        className="form-input"
                        required
                    >
                        <option value="">Select a booking</option>
                        {bookings.map((booking) => (
                            <option key={booking.id || booking.bookingID} value={booking.id || booking.bookingID}>
                                Booking #{booking.bookingID || booking.id} - {booking.cars?.[0]?.model || 'Car'} - R{booking.totalAmount || 500}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedBooking && (
                <>
                    <div style={{
                        backgroundColor: '#3a3a3a',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ margin: '5px 0', color: '#fff' }}>
                            <strong>Booking ID:</strong> #{selectedBooking.bookingID || selectedBooking.id}
                        </p>
                        <p style={{ margin: '5px 0', color: '#fff' }}>
                            <strong>Amount:</strong> R{selectedBooking.totalAmount || 500}
                        </p>
                        <p style={{ margin: '5px 0', color: '#fff' }}>
                            <strong>Car:</strong> {selectedBooking.cars?.[0]?.model || 'Car'}
                        </p>
                        <p style={{ margin: '5px 0', color: '#fff' }}>
                            <strong>Duration:</strong> {selectedBooking.startDate ? new Date(selectedBooking.startDate).toLocaleDateString() : 'Start'} - {selectedBooking.endDate ? new Date(selectedBooking.endDate).toLocaleDateString() : 'End'}
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
                                {isProcessing ? 'Processing...' : `Pay R${selectedBooking.totalAmount || 500}`}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default PaymentForm;