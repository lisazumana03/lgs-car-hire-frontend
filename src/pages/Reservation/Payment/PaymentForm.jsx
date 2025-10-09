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

            const paymentAmount = selectedBooking?.totalAmount || selectedBooking?.car?.rentalPrice || 500;
            const bookingId = selectedBooking?.bookingID || selectedBooking?.id;

            try {
                // Create payment
                const paymentRes = await fetch("http://localhost:3045/api/payment/create-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bookingId: parseInt(bookingId),
                        amount: paymentAmount,
                        paymentMethod: "PAYSTACK"
                    }),
                });

                console.log("Payment creation response status:", paymentRes.status);

                if (paymentRes.ok) {
                    const paymentText = await paymentRes.text();
                    console.log("Payment creation response text:", paymentText);

                    let paymentData;
                    try {
                        paymentData = JSON.parse(paymentText);
                    } catch (parseError) {
                        console.error("JSON parse error:", parseError);
                        paymentData = {
                            paymentID: Date.now(),
                            status: "PAID"
                        };
                    }

                    // Update payment status to PAID
                    if (paymentData.paymentID && paymentData.paymentID > 0) {
                        try {
                            const updateRes = await fetch(`http://localhost:3045/api/payment/update-status/${paymentData.paymentID}/PAID`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" }
                            });

                            if (updateRes.ok) {
                                console.log("Payment status updated to PAID");
                            }
                        } catch (updateError) {
                            console.error("Status update error:", updateError);
                        }

                        // CREATE INVOICE
                        await createInvoice(paymentData.paymentID);
                    } else {
                        navigate('/invoices');
                    }
                } else {
                    console.error("Payment creation failed");
                    navigate('/invoices');
                }
            } catch (err) {
                console.error("Payment processing error:", err);
                navigate('/invoices');
            }
        },
        onClose: () => {
            setMessage("Payment cancelled.");
        },
    };

    const createInvoice = async (paymentId) => {
        try {
            console.log("Creating invoice for payment:", paymentId);

            const invoiceRes = await fetch("http://localhost:3045/api/invoice/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paymentId: paymentId
                }),
            });

            if (invoiceRes.ok) {
                const invoiceData = await invoiceRes.json();
                console.log("Invoice created successfully:", invoiceData.invoiceID);

                // Wait a moment for the invoice to be fully processed
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Redirect to the new invoice
                navigate(`/invoice/${invoiceData.invoiceID}`);
            } else {
                console.error("Invoice creation failed, trying to find existing invoice");
                await redirectToInvoice(paymentId);
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            await redirectToInvoice(paymentId);
        }
    };

    // ADD THIS HELPER FUNCTION TO PaymentForm.jsx:
    const redirectToInvoice = async (paymentId) => {
        try {
            console.log("Finding invoice for payment:", paymentId);

            // Wait a moment for invoice generation
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Try to get invoices by payment ID
            const invoiceRes = await fetch(`http://localhost:3045/api/invoice/payment/${paymentId}`);

            if (invoiceRes.ok) {
                const invoices = await invoiceRes.json();
                if (invoices.length > 0) {
                    // Redirect to the first invoice found
                    const invoiceId = invoices[0].invoiceID;
                    console.log("Redirecting to invoice:", invoiceId);
                    navigate(`/invoice/${invoiceId}`);
                    return;
                }
            }

            // If no invoice found by payment, try to get user invoices and find the latest
            const userId = localStorage.getItem('userId') || '1';
            const userInvoicesRes = await fetch(`http://localhost:3045/api/invoice/user/${userId}`);

            if (userInvoicesRes.ok) {
                const userInvoices = await userInvoicesRes.json();
                if (userInvoices.length > 0) {
                    // Find the most recent invoice (last in array)
                    const latestInvoice = userInvoices[userInvoices.length - 1];
                    console.log("Redirecting to latest invoice:", latestInvoice.invoiceID);
                    navigate(`/invoice/${latestInvoice.invoiceID}`);
                    return;
                }
            }

            // Fallback: go to invoices list
            console.log("No invoice found, redirecting to invoices list");
            navigate('/invoices');

        } catch (error) {
            console.error("Error finding invoice:", error);
            // Fallback: go to invoices list
            navigate('/invoices');
        }
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