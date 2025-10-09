/**
 * Support Ticket Detail Component
 * Date: 09 October 2025
 * Displays detailed information about a single support ticket
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById } from "../../services/supportService";
import { ROUTES } from "../../constants";
import "./SupportTicketDetail.css";

function SupportTicketDetail() {
    const { ticketId } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            const response = await getTicketById(ticketId);
            setTicket(response.data);
        } catch (error) {
            console.error("Error fetching ticket details:", error);
            setMessage("Error loading ticket details");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        navigate(ROUTES.SUPPORT);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'status-open';
            case 'in_progress': return 'status-in-progress';
            case 'resolved': return 'status-resolved';
            case 'closed': return 'status-closed';
            default: return 'status-default';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'priority-critical';
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return 'priority-default';
        }
    };

    if (loading) {
        return <div className="loading-container">Loading ticket details...</div>;
    }

    if (!ticket) {
        return (
            <div className="error-container">
                <h2>Ticket Not Found</h2>
                <p>The support ticket you're looking for doesn't exist.</p>
                <button className="btn-primary" onClick={handleBackToList}>
                    Back to Support Tickets
                </button>
            </div>
        );
    }

    return (
        <div className="ticket-detail-container">
            <div className="detail-header">
                <button className="btn-back" onClick={handleBackToList}>
                    ← Back to All Tickets
                </button>
                <h2>Ticket #{ticket.ticketID}</h2>
            </div>

            {message && (
                <div className={`message message-${messageType}`}>
                    {message}
                </div>
            )}

            <div className="ticket-detail-card">
                <div className="ticket-status-bar">
                    <div className="status-badges">
                        <span className={`badge ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                        </span>
                        <span className={`badge ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                </div>

                <div className="ticket-subject">
                    <h3>{ticket.subject}</h3>
                </div>

                <div className="ticket-section">
                    <h4>Description</h4>
                    <p className="ticket-description">
                        {ticket.description || "No description provided"}
                    </p>
                </div>

                <div className="ticket-info-grid">
                    <div className="info-section">
                        <h4>Ticket Information</h4>
                        <div className="info-item">
                            <span className="info-label">Created:</span>
                            <span className="info-value">{formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Updated:</span>
                            <span className="info-value">{formatDate(ticket.updatedAt)}</span>
                        </div>
                        {ticket.resolvedAt && (
                            <div className="info-item">
                                <span className="info-label">Resolved:</span>
                                <span className="info-value">{formatDate(ticket.resolvedAt)}</span>
                            </div>
                        )}
                    </div>

                    <div className="info-section">
                        <h4>User Information</h4>
                        {ticket.user && (
                            <>
                                <div className="info-item">
                                    <span className="info-label">Name:</span>
                                    <span className="info-value">{ticket.user.name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{ticket.user.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Phone:</span>
                                    <span className="info-value">{ticket.user.phoneNumber || "N/A"}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {ticket.booking && (
                        <div className="info-section">
                            <h4>Related Booking</h4>
                            <div className="info-item">
                                <span className="info-label">Booking ID:</span>
                                <span className="info-value">#{ticket.booking.bookingID}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status:</span>
                                <span className="info-value">{ticket.booking.bookingStatus}</span>
                            </div>
                            {ticket.booking.startDate && (
                                <div className="info-item">
                                    <span className="info-label">Start Date:</span>
                                    <span className="info-value">{formatDate(ticket.booking.startDate)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {ticket.assignedTo && (
                        <div className="info-section">
                            <h4>Assigned To</h4>
                            <div className="info-item">
                                <span className="info-label">Staff Name:</span>
                                <span className="info-value">{ticket.assignedTo.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{ticket.assignedTo.email}</span>
                            </div>
                        </div>
                    )}
                </div>

                {ticket.status === 'RESOLVED' && (
                    <div className="resolved-notice">
                        <h4>✓ Ticket Resolved</h4>
                        <p>
                            This ticket has been marked as resolved. If you're still experiencing issues,
                            please create a new support ticket.
                        </p>
                    </div>
                )}

                {ticket.status === 'IN_PROGRESS' && (
                    <div className="progress-notice">
                        <h4>⏳ In Progress</h4>
                        <p>
                            Our support team is currently working on your issue.
                            You'll be notified once there's an update.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SupportTicketDetail;
