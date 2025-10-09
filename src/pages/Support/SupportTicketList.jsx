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

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === "all" || ticket.priority?.toLowerCase() === priorityFilter.toLowerCase();
        return matchesStatus && matchesPriority;
    });

    if (loading) {
        return <div className="loading-container">Loading support tickets...</div>;
    }

    return (
        <div className="support-ticket-list-container">
            <div className="support-header">
                <h2>Support Tickets</h2>
            </div>

            {message && (
                <div className={`message message-${messageType}`}>
                    {message}
                </div>
            )}

            <div className="ticket-filters-container">
                <div className="ticket-filter-group">
                    <label htmlFor="statusFilter">Status:</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="ticket-filter-select"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="ticket-filter-group">
                    <label htmlFor="priorityFilter">Priority:</label>
                    <select
                        id="priorityFilter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="ticket-filter-select"
                    >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <button className="btn-primary btn-create" onClick={handleCreateNew}>
                    + Create New Ticket
                </button>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="no-tickets">
                    <p>No support tickets found.</p>
                    <button className="btn-secondary" onClick={handleCreateNew}>
                        Create Your First Ticket
                    </button>
                </div>
            ) : (
                <div className="tickets-grid">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.ticketID} className="ticket-card">
                            <div className="ticket-header">
                                <h3>Ticket #{ticket.ticketID}</h3>
                                <div className="ticket-badges">
                                    <span className={`badge ${getStatusClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className={`badge ${getPriorityClass(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="ticket-content">
                                <h4>{ticket.subject}</h4>
                                <p className="ticket-description">
                                    {ticket.description?.length > 150
                                        ? `${ticket.description.substring(0, 150)}...`
                                        : ticket.description || "No description"}
                                </p>

                                <div className="ticket-meta">
                                    <div className="meta-item">
                                        <strong>Created:</strong> {formatDate(ticket.createdAt)}
                                    </div>
                                    {ticket.booking && (
                                        <div className="meta-item">
                                            <strong>Booking:</strong> #{ticket.booking.bookingID}
                                        </div>
                                    )}
                                    {ticket.assignedTo && (
                                        <div className="meta-item">
                                            <strong>Assigned to:</strong> {ticket.assignedTo.name}
                                        </div>
                                    )}
                                    {ticket.resolvedAt && (
                                        <div className="meta-item">
                                            <strong>Resolved:</strong> {formatDate(ticket.resolvedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="ticket-actions">
                                <button
                                    className="btn-view"
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
