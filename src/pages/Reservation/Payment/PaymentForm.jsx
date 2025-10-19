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
            const response = await getAllBookings();
            setBookings(response.data || []);
        } catch (error) {
            setMessage('Failed to load bookings');
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
                    
                    // Try to create invoice
                    try {
                        console.log("Creating invoice with paymentId:", paymentId);
                        const invoiceRes = await fetch("http://localhost:3045/api/invoice/create", {
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                paymentId: paymentId
                            }),
                        });

                        console.log("Invoice API response status:", invoiceRes.status);

                        if (invoiceRes.ok) {
                            const invoiceData = await invoiceRes.json();
                            console.log("Invoice created successfully:", invoiceData);
                            // Redirect to invoice view
                            navigate(`/invoice/${invoiceData.invoiceID}`);
                        } else {
                            const errorText = await invoiceRes.text();
                            console.error("Invoice creation failed:", invoiceRes.status, errorText);
                            // Still redirect to invoices list
                            navigate('/invoices', {
                                state: { 
                                    message: "Payment successful but invoice creation failed. Please check your invoices.",
                                    paymentId: paymentId
                                }
                            });
                        }
                    } catch (invoiceError) {
                        console.error("Invoice creation error:", invoiceError);
                        navigate('/invoices', {
                            state: { 
                                message: "Payment successful! Your invoice should appear shortly.",
                                paymentId: paymentId
                            }
                        });
                    }
                } else {
                    const errorText = await paymentRes.text();
                    console.error("Payment API failed:", paymentRes.status, errorText);
                    
                    if (paymentRes.status === 403) {
                        console.error("403 Forbidden - Check backend permissions for /api/payment/create-payment");
                        setMessage("Payment recorded by Paystack but backend permission error. Contact support.");
                    }
                    
                    // Still show success to user since Paystack payment went through
                    navigate('/invoices', {
                        state: { 
                            message: "Payment completed via Paystack. If invoice doesn't appear, contact support with reference: " + response.reference
                        }
                    });
                }
            } catch (err) {
                console.error("Payment processing error:", err);
                navigate('/invoices', {
                    state: { 
                        message: "Payment may have been processed. Please check your invoices or contact support."
                    }
                });
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
                <button onClick={() => navigate('/bookings')}>Go to Bookings</button>
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