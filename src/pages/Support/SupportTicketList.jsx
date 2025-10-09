/**
 * Support Ticket List Component
 * Date: 09 October 2025
 * Displays all support tickets for the current user
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTicketsByUser } from "../../services/supportService";
import { getUserData } from "../../services/authService";
import { ROUTES } from "../../constants";
import "./SupportTicketList.css";

function SupportTicketList() {
    const navigate = useNavigate();
    const userData = getUserData();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    useEffect(() => {
        if (userData?.userId) {
            fetchTickets();
        }
    }, [userData?.userId]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await getTicketsByUser(userData.userId);
            setTickets(response.data || []);
        } catch (error) {
            console.error("Error fetching support tickets:", error);
            setMessage("Error loading support tickets");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (ticketId) => {
        navigate(`/support/${ticketId}`);
    };

    const handleCreateNew = () => {
        navigate(ROUTES.SUPPORT_NEW);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === "all" || ticket.priority?.toLowerCase() === priorityFilter.toLowerCase();
        return matchesStatus && matchesPriority;
    });

    if (loading) {
        return <div className="support-ticket-loading-container">Loading support tickets...</div>;
    }

    return (
        <div className="support-ticket-list-container">
            <div className="support-ticket-header">
                <h2>Support Tickets</h2>
            </div>

            {message && (
                <div className={`support-ticket-message support-ticket-message-${messageType}`}>
                    {message}
                </div>
            )}

            <div className="support-ticket-filters-container">
                <div className="support-ticket-filter-group">
                    <label htmlFor="statusFilter">Status:</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="support-ticket-filter-select"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="support-ticket-filter-group">
                    <label htmlFor="priorityFilter">Priority:</label>
                    <select
                        id="priorityFilter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="support-ticket-filter-select"
                    >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <button className="support-ticket-btn-primary support-ticket-btn-create" onClick={handleCreateNew}>
                    + Create New Ticket
                </button>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="support-ticket-no-tickets">
                    <p>No support tickets found.</p>
                    <button className="support-ticket-btn-secondary" onClick={handleCreateNew}>
                        Create Your First Ticket
                    </button>
                </div>
            ) : (
                <div className="support-ticket-grid">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.ticketID} className="support-ticket-card">
                            <div className="support-ticket-card-header">
                                <h3>Ticket #{ticket.ticketID}</h3>
                                <div className="support-ticket-badges">
                                    <span className={`support-ticket-badge ${getStatusClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className={`support-ticket-badge ${getPriorityClass(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="support-ticket-content">
                                <h4>{ticket.subject}</h4>
                                <p className="support-ticket-description">
                                    {ticket.description?.length > 150
                                        ? `${ticket.description.substring(0, 150)}...`
                                        : ticket.description || "No description"}
                                </p>

                                <div className="support-ticket-meta">
                                    <div className="support-ticket-meta-item">
                                        <strong>Created:</strong> {formatDate(ticket.createdAt)}
                                    </div>
                                    {ticket.booking && (
                                        <div className="support-ticket-meta-item">
                                            <strong>Booking:</strong> #{ticket.booking.bookingID}
                                        </div>
                                    )}
                                    {ticket.assignedTo && (
                                        <div className="support-ticket-meta-item">
                                            <strong>Assigned to:</strong> {ticket.assignedTo.name}
                                        </div>
                                    )}
                                    {ticket.resolvedAt && (
                                        <div className="support-ticket-meta-item">
                                            <strong>Resolved:</strong> {formatDate(ticket.resolvedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="support-ticket-actions">
                                <button
                                    className="support-ticket-btn-view"
                                    onClick={() => handleViewDetails(ticket.ticketID)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SupportTicketList;
