/**
 * New Support Ticket Component
 * Date: 09 October 2025
 * Form for creating a new support ticket
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../services/supportService";
import { getAllBookings } from "../../services/bookingService";
import { getUserData } from "../../services/authService";
import { ROUTES } from "../../constants";
import "./NewSupportTicket.css";

function NewSupportTicket() {
    const navigate = useNavigate();
    const userData = getUserData();

    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        priority: "MEDIUM",
        bookingId: ""
    });

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        try {
            const response = await getAllBookings();
            // Filter to only show user's bookings
            const userBookings = response.data.filter(
                booking => booking.user?.userId === userData?.userId
            );
            setBookings(userBookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.subject.trim()) {
            setMessage("Please enter a subject");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const ticketData = {
                user: {
                    userId: userData.userId
                },
                subject: formData.subject,
                description: formData.description,
                priority: formData.priority,
                status: "OPEN"
            };

            // Add booking if selected
            if (formData.bookingId) {
                ticketData.booking = {
                    bookingID: parseInt(formData.bookingId)
                };
            }

            await createTicket(ticketData);

            setMessage("Support ticket created successfully!");
            setMessageType("success");

            // Redirect to support tickets list after 2 seconds
            setTimeout(() => {
                navigate(ROUTES.SUPPORT);
            }, 2000);

        } catch (error) {
            console.error("Error creating ticket:", error);
            setMessage(error.response?.data?.message || "Error creating support ticket");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.SUPPORT);
    };

    return (
        <div className="new-ticket-container">
            <div className="new-ticket-header">
                <h2>Create Support Ticket</h2>
                <p className="header-description">
                    Having an issue with your booking or need assistance? Submit a support ticket and our team will help you as soon as possible.
                </p>
            </div>

            {message && (
                <div className={`message message-${messageType}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-group">
                    <label htmlFor="subject">
                        Subject <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief description of your issue"
                        maxLength="255"
                        required
                        className="form-input"
                    />
                    <small className="form-hint">Maximum 255 characters</small>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide detailed information about your issue..."
                        rows="6"
                        maxLength="2000"
                        className="form-textarea"
                    />
                    <small className="form-hint">
                        Maximum 2000 characters ({formData.description.length}/2000)
                    </small>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority">
                            Priority <span className="required">*</span>
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="LOW">Low - General inquiry</option>
                            <option value="MEDIUM">Medium - Standard issue</option>
                            <option value="HIGH">High - Urgent issue</option>
                            <option value="CRITICAL">Critical - Emergency</option>
                        </select>
                        <small className="form-hint">
                            Select priority based on urgency
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bookingId">Related Booking (Optional)</label>
                        <select
                            id="bookingId"
                            name="bookingId"
                            value={formData.bookingId}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">No related booking</option>
                            {bookings.map((booking) => (
                                <option key={booking.bookingID} value={booking.bookingID}>
                                    Booking #{booking.bookingID} - {booking.bookingStatus}
                                </option>
                            ))}
                        </select>
                        <small className="form-hint">
                            Link this ticket to a specific booking if applicable
                        </small>
                    </div>
                </div>

                <div className="info-box">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>Your ticket will be reviewed by our support team</li>
                        <li>You'll receive updates as your ticket is being handled</li>
                        <li>Critical and high priority tickets are handled first</li>
                        <li>You can view your ticket status anytime in "My Support Tickets"</li>
                    </ul>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewSupportTicket;
