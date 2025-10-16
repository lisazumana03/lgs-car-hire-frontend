import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { getAllBookings } from "../../../services/booking.service";
import '../PaymentForm/PaymentForm.css';

const PaymentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingFromState = location.state?.booking;

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(bookingFromState || null);
    const [loading, setLoading] = useState(!bookingFromState);
    const [message, setMessage] = useState('');

    const publicKey = "pk_test_449cd792d931e2771ebbe28763ec288c46bc3a10"; // Paystack test public key
    const customerEmail = "test@example.com"; // Test email for development

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
            setBookings([]);
        } finally {
            setLoading(false);
        }
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
                <button onClick={() => navigate('/bookings')}>Go to Bookings</button>
            </div>
        );
    }

    const componentProps = {
        email: customerEmail,
        amount: (selectedBooking?.totalAmount || 500) * 100, // Paystack uses cents (kobo)
        publicKey,
        text: `Pay R${selectedBooking?.totalAmount || 500}`,
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
            console.log("Payment success:", response);

            // Calculate the correct amount
            const paymentAmount = selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500;
            const bookingId = selectedBooking?.bookingID || selectedBooking?.id;

            console.log("Payment verification data:", {
                amount: paymentAmount,
                bookingId: bookingId,
                reference: response.reference,
                paymentMethod: "PAYSTACK"
            });

            // Send to backend for verification
            try {
                const res = await fetch("http://localhost:3045/api/payments/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: paymentAmount,
                        bookingId: bookingId,
                        reference: response.reference,
                        paymentMethod: "PAYSTACK"
                    }),
                });

                const data = await res.json();
                console.log("Backend verification:", data);

                navigate('/payment/confirmation', {
                    state: { payment: data, booking: selectedBooking }
                });
            } catch (err) {
                console.error("Verification failed:", err);
                setMessage("Payment could not be verified.");
            }
        },
        onClose: () => {
            setMessage("Payment cancelled.");
        },
    };

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
                            <option value="">Select a booking</option>
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
                                <p><strong>Amount:</strong> <span className="booking-amount">R{selectedBooking.totalAmount || 500}</span></p>
                                <p><strong>Car:</strong> <span>{selectedBooking.cars?.[0]?.model || 'Car'}</span></p>
                            </div>
                        </div>

                        {message && (
                            <div className={`payment-message ${message.includes('error') || message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}

                        {/* Paystack button */}
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