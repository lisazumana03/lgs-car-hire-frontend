import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTickets, updateSupport, deleteSupport } from "../../../services/supportService";

const SupportEditList = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ subject: '', description: '', userId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch all support tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getAllTickets();
      setSupportTickets(response.data || []);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setSupportTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete a support ticket
  const handleDelete = async (ticketID) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteSupport(ticketID);
        fetchTickets();
      } catch (err) {
        console.error('Error deleting ticket:', err);
        alert("Failed to delete ticket.");
      }
    }
  };

  // Start editing
  const handleEditClick = (ticket) => {
    const id = ticket.ticketID;
    const userId =
      (ticket.user && (ticket.user.userId || ticket.user.id)) ||
      ticket.userId ||
      ticket.user_id ||
      ticket.userID ||
      null;

    setEditingId(id);
    setEditForm({
      subject: ticket.subject,
      description: ticket.description,
      userId: userId,
    });
  };

  // Handle input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  // Submit edited data (keep same userId)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const payload = {
      ticketID: editingId,
      subject: editForm.subject,
      description: editForm.description,
      user: { userId: editForm.userId },
    };

    try {
      await updateSupport(payload);
      setEditingId(null);
      fetchTickets();
      alert('Support ticket updated successfully!');
    } catch (err) {
      console.error('Failed to update ticket', err);
      alert('Failed to update ticket.');
    }
  };

  return (
    <div
      className="main-content"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #232526 0%, #414345 100%)",
      }}
    >
      <div
        className="dashboard-container"
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "rgba(30, 41, 59, 0.98)",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          padding: "2.5rem",
          marginTop: "2rem",
        }}
      >
        <h1
          style={{
            marginBottom: "30px",
            color: "#fff",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Edit Support Tickets
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Back
          </button>
          <button
            onClick={fetchTickets}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(90deg, #F87171 0%, #FBBF24 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        {loading && (
          <p style={{ color: "#fff", textAlign: "center" }}>
            Loading support tickets...
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "30px",
            marginTop: "2rem",
          }}
        >
          {supportTickets.length === 0 && !loading ? (
            <div
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              No support tickets found.
            </div>
          ) : (
            supportTickets.map((ticket) => {
              const ticketId = ticket.ticketID || ticket.id || ticket._id;
              const userId =
                (ticket.user && (ticket.user.userId || ticket.user.id)) ||
                ticket.userId ||
                ticket.user_id ||
                ticket.userID ||
                "N/A";
              const userName =
                (ticket.user && (ticket.user.fullName || ticket.user.name)) ||
                ticket.fullName ||
                ticket.name;

              return (
                <div
                  key={ticketId}
                  style={{
                    background: "linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)",
                    borderRadius: "22px",
                    boxShadow: "0 8px 32px rgba(30,41,59,0.18)",
                    maxWidth: "600px",
                    overflow: "hidden",
                    margin: "0 auto",
                    marginBottom: "40px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
                      padding: "26px 36px",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "22px",
                      borderTopRightRadius: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#fff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "2.2rem",
                        marginRight: "26px",
                        boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
                      }}
                    >
                      {ticket.subject ? ticket.subject.charAt(0) : "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.35rem",
                          color: "#fff",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {ticket.subject || "No Subject"}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "1rem",
                          color: "#e0e7ef",
                          marginTop: "2px",
                        }}
                      >
                        Ticket ID: {ticketId}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div
                    style={{
                      background: "#f1f5f9",
                      padding: "22px 36px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#2563eb",
                        fontSize: "1.12rem",
                      }}
                    >
                      User ID:{" "}
                    </span>
                    <span
                      style={{
                        color: "#334155",
                        fontSize: "1.12rem",
                        fontWeight: "500",
                      }}
                    >
                      {userId}
                    </span>
                    {userName && (
                      <span
                        style={{
                          marginLeft: "18px",
                          color: "#2563eb",
                          fontWeight: "bold",
                          fontSize: "1.12rem",
                        }}
                      >
                        Name:{" "}
                        <span
                          style={{ color: "#334155", fontWeight: "500" }}
                        >
                          {userName}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      padding: "28px 36px",
                      background: "#fff",
                      borderBottomLeftRadius: "22px",
                      borderBottomRightRadius: "22px",
                    }}
                  >
                    {editingId === ticketId ? (
                      <form onSubmit={handleEditSubmit}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "600",
                            color: "#2563eb",
                            marginBottom: "6px",
                          }}
                        >
                          Subject
                        </label>
                        <input
                          name="subject"
                          value={editForm.subject}
                          onChange={handleEditChange}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            marginBottom: "8px",
                          }}
                          required
                        />
                        <label
                          style={{
                            display: "block",
                            fontWeight: "600",
                            color: "#2563eb",
                            marginBottom: "6px",
                          }}
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                          }}
                          required
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "12px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              background: "#4ade80",
                              color: "white",
                              padding: "8px 18px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            style={{
                              background: "#aaa",
                              color: "white",
                              padding: "8px 18px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#2563eb",
                            fontSize: "1.12rem",
                          }}
                        >
                          Description:{" "}
                        </span>
                        <span
                          style={{
                            color: "#334155",
                            fontSize: "1.12rem",
                            fontWeight: "500",
                          }}
                        >
                          {ticket.description ||
                            ticket.problem ||
                            ticket.issue ||
                            "No description provided."}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "18px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            style={{
                              background: "#007bff",
                              color: "white",
                              padding: "8px 18px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditClick(ticket)}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              background: "#dc2626",
                              color: "white",
                              padding: "8px 18px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleDelete(ticket.ticketID || ticket.id || ticket._id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportEditList;
