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
            case 'open': return 'support-ticket-status-open';
            case 'in_progress': return 'support-ticket-status-in-progress';
            case 'resolved': return 'support-ticket-status-resolved';
            case 'closed': return 'support-ticket-status-closed';
            default: return 'support-ticket-status-default';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'support-ticket-priority-critical';
            case 'high': return 'support-ticket-priority-high';
            case 'medium': return 'support-ticket-priority-medium';
            case 'low': return 'support-ticket-priority-low';
            default: return 'support-ticket-priority-default';
        }
    };

    if (loading) {
        return <div className="support-loading-container">Loading ticket details...</div>;
    }

    if (!ticket) {
        return (
            <div className="support-error-container">
                <h2>Ticket Not Found</h2>
                <p>The support ticket you're looking for doesn't exist.</p>
                <button className="support-btn-primary" onClick={handleBackToList}>
                    Back to Support Tickets
                </button>
            </div>
        );
    }

    return (
        <div className="support-ticket-detail-container">
            <div className="support-detail-header">
                <button className="support-btn-back" onClick={handleBackToList}>
                    ← Back to All Tickets
                </button>
                <h2>Ticket #{ticket.ticketID}</h2>
            </div>

            {message && (
                <div className={`support-ticket-message support-ticket-message-${messageType}`}>
                    {message}
                </div>
            )}

            <div className="support-ticket-detail-card">
                <div className="support-ticket-status-bar">
                    <div className="support-status-badges">
                        <span className={`support-ticket-badge ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                        </span>
                        <span className={`support-ticket-badge ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                </div>

                <div className="support-ticket-subject">
                    <h3>{ticket.subject}</h3>
                </div>

                <div className="support-ticket-section">
                    <h4>Description</h4>
                    <p className="support-ticket-description">
                        {ticket.description || "No description provided"}
                    </p>
                </div>

                <div className="support-ticket-info-grid">
                    <div className="support-info-section">
                        <h4>Ticket Information</h4>
                        <div className="support-info-item">
                            <span className="support-info-label">Created:</span>
                            <span className="support-info-value">{formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="support-info-item">
                            <span className="support-info-label">Last Updated:</span>
                            <span className="support-info-value">{formatDate(ticket.updatedAt)}</span>
                        </div>
                        {ticket.resolvedAt && (
                            <div className="support-info-item">
                                <span className="support-info-label">Resolved:</span>
                                <span className="support-info-value">{formatDate(ticket.resolvedAt)}</span>
                            </div>
                        )}
                    </div>

                    <div className="support-info-section">
                        <h4>User Information</h4>
                        {ticket.user && (
                            <>
                                <div className="support-info-item">
                                    <span className="support-info-label">Name:</span>
                                    <span className="support-info-value">{ticket.user.name}</span>
                                </div>
                                <div className="support-info-item">
                                    <span className="support-info-label">Email:</span>
                                    <span className="support-info-value">{ticket.user.email}</span>
                                </div>
                                <div className="support-info-item">
                                    <span className="support-info-label">Phone:</span>
                                    <span className="support-info-value">{ticket.user.phoneNumber || "N/A"}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {ticket.booking && (
                        <div className="support-info-section">
                            <h4>Related Booking</h4>
                            <div className="support-info-item">
                                <span className="support-info-label">Booking ID:</span>
                                <span className="support-info-value">#{ticket.booking.bookingID}</span>
                            </div>
                            <div className="support-info-item">
                                <span className="support-info-label">Status:</span>
                                <span className="support-info-value">{ticket.booking.bookingStatus}</span>
                            </div>
                            {ticket.booking.startDate && (
                                <div className="support-info-item">
                                    <span className="support-info-label">Start Date:</span>
                                    <span className="support-info-value">{formatDate(ticket.booking.startDate)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {ticket.assignedTo && (
                        <div className="support-info-section">
                            <h4>Assigned To</h4>
                            <div className="support-info-item">
                                <span className="support-info-label">Staff Name:</span>
                                <span className="support-info-value">{ticket.assignedTo.name}</span>
                            </div>
                            <div className="support-info-item">
                                <span className="support-info-label">Email:</span>
                                <span className="support-info-value">{ticket.assignedTo.email}</span>
                            </div>
                        </div>
                    )}
                </div>

                {ticket.status === 'RESOLVED' && (
                    <div className="support-resolved-notice">
                        <h4>✓ Ticket Resolved</h4>
                        <p>
                            This ticket has been marked as resolved. If you're still experiencing issues,
                            please create a new support ticket.
                        </p>
                    </div>
                )}

                {ticket.status === 'IN_PROGRESS' && (
                    <div className="support-progress-notice">
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
