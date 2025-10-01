import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Removed static tickets, will fetch from API


const SupportList = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3045/support/all")
      .then((res) => {
        setSupportTickets(res.data);
      })
      .catch((err) => {
        setSupportTickets([]);
      });
  }, []);

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <h1 style={{marginBottom: '30px'}}>Support Tickets</h1>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
          {supportTickets.length === 0 ? (
            <div>No support tickets found.</div>
          ) : (
            supportTickets.map((ticket) => (
              <div key={ticket.ticketID || ticket.id || ticket._id} className="stat-card" style={{backgroundColor: '#3a3a3a', color: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '25px', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div style={{marginBottom: '10px'}}>
                  <span style={{color: '#FFD700', fontWeight: 'bold'}}>Ticket ID:</span>
                  <span style={{color: 'white', marginLeft: '8px'}}>{ticket.ticketID || ticket.id || ticket._id || 'N/A'}</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span style={{color: '#4ade80', fontWeight: 'bold'}}>Subject:</span>
                  <span style={{color: 'white', marginLeft: '8px'}}>{ticket.subject || 'No subject provided.'}</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span style={{color: '#FFD700', fontWeight: 'bold'}}>Description:</span>
                  <span style={{color: 'white', marginLeft: '8px'}}>{ticket.description || ticket.problem || ticket.issue || 'No description provided.'}</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <span style={{color: '#FFD700', fontWeight: 'bold'}}>User ID:</span>
                  <span style={{color: 'white', marginLeft: '8px'}}>{ticket.user_id || ticket.problem || ticket.issue || 'No description provided.'}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <button type="button" className="button-primary" style={{marginTop: '30px', maxWidth: '300px'}} onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};


export default SupportList;