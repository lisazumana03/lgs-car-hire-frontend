import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { getAllBookings } from '../../../services/bookingService';
import './PaymentForm.css';

const PaymentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingFromState = location.state?.booking;

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(bookingFromState || null);
    const [loading, setLoading] = useState(!bookingFromState);
    const [message, setMessage] = useState('');

    const publicKey = "pk_test_449cd792d931e2771ebbe28763ec288c46bc3a10";
    const customerEmail = "test@example.com";

    useEffect(() => {
        if (!bookingFromState) {
            fetchBookings();
        }
    }, [bookingFromState]);

    const fetchBookings = async () => {
        try {
            console.log('Fetching bookings...');
            console.log('Token present:', !!localStorage.getItem('token'));
            console.log('User present:', !!localStorage.getItem('user'));
            
            const response = await getAllBookings();
            console.log('Bookings response:', response);
            console.log('Bookings data:', response.data);
            
            // Handle different response structures
            const bookingsData = response.data || response || [];
            console.log('Processed bookings data:', bookingsData);
            
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            console.error('Error message:', error.message);
            console.error('Error response:', error.response);
            setMessage(`Failed to load bookings: ${error.message}`);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const componentProps = {
        email: customerEmail,
        amount: (selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500) * 100,
        publicKey,
        text: `Pay R${selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500}`,
        currency: "ZAR",
        metadata: {
            custom_fields: [
                {
                    display_name: "Booking ID",
                    variable_name: "booking_id",
                    value: selectedBooking?.bookingID || selectedBooking?.id,
                },
            ],
        },
        onSuccess: async (response) => {
            const paymentAmount = selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500;
            const bookingId = selectedBooking?.bookingID || selectedBooking?.id;

            try {
                const token = localStorage.getItem('token');
                console.log("Creating payment with token:", token ? "Present" : "Missing");
                
                const paymentRes = await fetch("http://localhost:3045/api/payment/create-payment", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bookingId: parseInt(bookingId),
                        amount: paymentAmount,
                        paymentMethod: "PAYSTACK"
                    }),
                });

                console.log("Payment API response status:", paymentRes.status);

                if (paymentRes.ok) {
                    const paymentData = await paymentRes.json();
                    console.log("Payment successful:", paymentData);
                    const paymentId = paymentData.paymentID || paymentData.id;
                    
                    // Validate booking ID before navigation
                    console.log('Navigating to booking details with ID:', bookingId);
                    if (!bookingId) {
                        console.error('No booking ID available for navigation');
                        setMessage('Payment successful but unable to navigate to booking details.');
                        return;
                    }
                    
                    // Navigate directly to booking details after successful payment
                    navigate(`/booking-details/${bookingId}`, {
                        state: {
                            paymentSuccess: true,
                            message: "Your payment has been processed successfully!",
                            bookingId: bookingId, // Explicitly pass booking ID
                            paymentData: {
                                reference: paymentData.reference || response.reference,
                                amount: paymentAmount,
                                status: paymentData.status || 'COMPLETED',
                                paymentID: paymentId
                            }
                        }
                    });
                } else {
                    const errorText = await paymentRes.text();
                    console.error("Payment API failed:", paymentRes.status, errorText);
                    
                    if (paymentRes.status === 403) {
                        console.error("403 Forbidden - Check backend permissions for /api/payment/create-payment");
                        setMessage("Payment recorded by Paystack but backend permission error. Contact support.");
                    }
                    
                    // Still navigate to booking details since Paystack payment went through
                    if (bookingId) {
                        navigate(`/booking-details/${bookingId}`, {
                            state: { 
                                paymentSuccess: true,
                                message: "Payment completed via Paystack. Reference: " + response.reference,
                                bookingId: bookingId
                            }
                        });
                    } else {
                        setMessage("Payment completed but unable to navigate to booking details.");
                    }
                }
            } catch (err) {
                console.error("Payment processing error:", err);
                if (bookingId) {
                    navigate(`/booking-details/${bookingId}`, {
                        state: { 
                            paymentSuccess: true,
                            message: "Payment may have been processed. Please check with support if you have any questions.",
                            bookingId: bookingId
                        }
                    });
                } else {
                    setMessage("Payment may have been processed. Please check your bookings.");
                }
            }
        },
        onClose: () => {
            setMessage("Payment cancelled.");
        },
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        );
    }

    if (!selectedBooking && bookings.length === 0) {
        return (
            <div className="no-bookings">
                <p>No bookings found. Please create a booking first.</p>
                {message && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        {message}
                    </div>
                )}
                <button onClick={() => navigate('/bookings')}>Go to Bookings</button>
                <button onClick={() => fetchBookings()} style={{ marginLeft: '10px' }}>Retry Loading</button>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <div className="payment-wrapper">
                <h1 className="payment-title">Make Payment</h1>

                {!bookingFromState && (
                    <div className="booking-selection">
                        <h3>Select a Booking</h3>
                        <select
                            value={selectedBooking?.id || ""}
                            onChange={(e) => {
                                const bookingId = e.target.value;
                                const booking = bookings.find(b => b.id === bookingId || b.bookingID === bookingId);
                                setSelectedBooking(booking);
                            }}
                            className="booking-select"
                        >
                            <option value="">Choose a booking to pay for...</option>
                            {bookings.map((b) => (
                                <option key={b.id || b.bookingID} value={b.id || b.bookingID}>
                                    Booking #{b.bookingID || b.id} - {b.cars?.[0]?.model || 'Car'} - R{b.totalAmount || 500}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedBooking && (
                    <>
                        <div className="booking-details">
                            <h3>Booking Details</h3>
                            <div className="booking-info">
                                <p><strong>Booking ID:</strong> <span>#{selectedBooking.bookingID || selectedBooking.id}</span></p>
                                <p><strong>Car:</strong> <span>{selectedBooking.car?.brand} {selectedBooking.car?.model} ({selectedBooking.car?.year})</span></p>
                                <p><strong>Rental Period:</strong> <span>{selectedBooking.startDate} to {selectedBooking.endDate}</span></p>
                                <p><strong>Amount:</strong> <span className="booking-amount">R{selectedBooking.totalAmount || selectedBooking.car?.rentalPrice || 500}</span></p>
                                {selectedBooking.car?.rentalPrice && selectedBooking.totalAmount && selectedBooking.totalAmount !== selectedBooking.car.rentalPrice && (
                                    <p className="booking-calculation">
                                        (R{selectedBooking.car.rentalPrice}/day × {Math.ceil((new Date(selectedBooking.endDate) - new Date(selectedBooking.startDate)) / (1000 * 60 * 60 * 24))} days)
                                    </p>
                                )}
                            </div>
                        </div>

                        {message && (
                            <div className={`payment-message ${message.includes('error') || message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}

                        <div className="payment-button-container">
                            <PaystackButton {...componentProps} className="payment-button" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentForm;