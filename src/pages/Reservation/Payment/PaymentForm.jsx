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

    // Debug: Log the booking data to see what we're working with
    console.log("Selected booking data:", selectedBooking);
    console.log("Total amount:", selectedBooking?.totalAmount);
    console.log("Car rental price:", selectedBooking?.car?.rentalPrice);

    const componentProps = {
        email: customerEmail,
        amount: (selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500) * 100, // Paystack uses cents (kobo)
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
            console.log("Payment success:", response);

            // Calculate the correct amount
            const paymentAmount = selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500;
            const bookingId = selectedBooking?.bookingID || selectedBooking?.id;

            console.log("Creating payment for booking:", bookingId);

            // Simple payment creation - no verification needed
            try {
                const res = await fetch("http://localhost:3045/api/payment/create-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bookingId: parseInt(bookingId), // Ensure it's a number
                        amount: paymentAmount,
                        paymentMethod: "PAYSTACK"
                    }),
                });

                console.log("Response status:", res.status);

                // If payment is created (201) OR if there's any successful status
                if (res.status === 201 || res.status === 200) {
                    try {
                        const paymentData = await res.json();
                        console.log("Payment created successfully:", paymentData);

                        navigate('/payment/confirmation', {
                            state: {
                                payment: paymentData,
                                booking: selectedBooking
                            }
                        });
                    } catch (jsonError) {
                        console.log("Payment created successfully (non-JSON response)");
                        // Even if we can't parse JSON, proceed to confirmation
                        navigate('/payment/confirmation', {
                            state: {
                                payment: { status: "success" },
                                booking: selectedBooking
                            }
                        });
                    }
                } else {
                    // Payment is still successful from Paystack, just show warning
                    console.warn("Payment processed but backend response was:", res.status);
                    navigate('/payment/confirmation', {
                        state: {
                            payment: { status: "processed" },
                            booking: selectedBooking
                        }
                    });
                }
            } catch (err) {
                console.error("Network error:", err);
                // Even with network errors, if Paystack succeeded, payment went through
                navigate('/payment/confirmation', {
                    state: {
                        payment: { status: "completed" },
                        booking: selectedBooking
                    }
                });
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