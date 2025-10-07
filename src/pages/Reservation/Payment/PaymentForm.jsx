import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { getAllBookings } from '../../../services/bookingService';
import NotificationService from '../../../services/notificationService';
import './PaymentForm.css';

const PaymentForm = ({ user }) => {
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
        currency: "ZAR", // Add currency
        metadata: {
            custom_fields: [
                {
                    display_name: "Booking ID",
                    variable_name: "booking_id",
                    value: selectedBooking?.bookingID || selectedBooking?.id,
                },
            ],
        },
        callback: (response) => {
            console.log("Payment callback:", response);
            // Handle the callback manually since we can't use localhost
        },
        onSuccess: async (response) => {
            console.log("Payment success:", response);

            // Calculate the correct amount
            const paymentAmount = selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500;
            const bookingId = selectedBooking?.bookingID || selectedBooking?.id;
            
            // Get user ID from multiple possible sources
            const userId = user?.id || user?.userID || user?.userId || 
                          selectedBooking?.user?.userId || selectedBooking?.user?.id ||
                          selectedBooking?.userId;

            console.log("Payment verification data:", {
                amount: paymentAmount,
                bookingId: bookingId,
                userId: userId,
                user: user,
                selectedBooking: selectedBooking,
                reference: response.reference,
                paymentMethod: "PAYSTACK"
            });

            // Since payment verification endpoint doesn't exist in backend, 
            // we'll just show success and create notification
            try {
                console.log("Payment successful with reference:", response.reference);
                
                // Create notification for successful payment
                try {
                    if (userId && bookingId) {
                        await NotificationService.createPaymentNotification(
                            userId, 
                            bookingId, 
                            paymentAmount,
                            'COMPLETED'
                        );
                        console.log("Payment notification created successfully");
                    } else {
                        console.warn("Skipping notification - missing userId or bookingId:", { userId, bookingId });
                    }
                } catch (notificationError) {
                    console.error("Failed to create payment notification:", notificationError);
                    // Don't fail the payment if notification fails
                }

                // Create a mock payment data for the confirmation page
                const mockPaymentData = {
                    reference: response.reference,
                    amount: paymentAmount,
                    bookingId: bookingId,
                    paymentMethod: "PAYSTACK",
                    status: "COMPLETED"
                };

                navigate('/payment/confirmation', {
                    state: { payment: mockPaymentData, booking: selectedBooking }
                });
            } catch (err) {
                console.error("Payment processing failed:", err);
                setMessage("Payment completed but notification failed.");
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