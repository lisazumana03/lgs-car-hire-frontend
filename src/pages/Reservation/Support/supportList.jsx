import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTickects } from "../../../services/supportService";

const supportTickets = [
  {
    id: 1,
    name: "Alice",
    problem: "Unable to login to my account.",
  },


  {
    id: 2,
    name: "Bob",
    problem: "Payment not going through.",
  },

  
  {
    id: 3,
    name: "Charlie",
    problem: "Car reservation not showing up.",
  },
];

const SupportList = ({ user }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickects();
      // Filter tickets for current user if user is logged in
      const userTickets = user ? response.data.filter(ticket => ticket.userId === user.id) : response.data;
      setTickets(userTickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load support tickets');
      // Fallback to hardcoded data for demo
      setTickets(supportTickets);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="dashboard-container">
          <h1>Support Tickets</h1>
          <p>Loading your support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <h1 style={{marginBottom: '30px'}}>
          {user ? `${user.name}'s Support Tickets` : 'Support Tickets'}
        </h1>
        
        {error && (
          <div style={{color: '#ef4444', marginBottom: '20px', padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px'}}>
            {error}
          </div>
        )}
        
        {tickets.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
            <h3>No support tickets found</h3>
            <p>You haven't submitted any support tickets yet.</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
            {tickets.map((ticket) => (
              <div key={ticket.id || ticket.ticketId} className="stat-card" style={{backgroundColor: '#3a3a3a', color: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '25px', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginRight: '15px', boxShadow: '0 2px 8px rgba(0,123,255,0.2)'}}>
                    {(ticket.userName || ticket.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#4ade80'}}>
                      {ticket.userName || ticket.name || 'Unknown User'}
                    </span>
                  </div>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span style={{color: '#FFD700', fontSize: '1.05rem', fontWeight: 'bold'}}>Subject:</span>
                  <span style={{color: 'white', fontSize: '1rem', marginLeft: '8px'}}>
                    {ticket.subject || 'No subject'}
                  </span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span style={{color: '#FFD700', fontSize: '1.05rem', fontWeight: 'bold'}}>Message:</span>
                  <span style={{color: 'white', fontSize: '1rem', marginLeft: '8px'}}>
                    {ticket.message || ticket.problem || 'No message'}
                  </span>
                </div>
                {ticket.userId && (
                  <div style={{fontSize: '0.9rem', color: '#9ca3af'}}>
                    User ID: {ticket.userId}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <button type="button" className="button-primary" style={{marginTop: '30px', maxWidth: '300px'}} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};


export default SupportList;