import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupportEditList = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    axios.get("http://localhost:3045/support/all")
      .then((res) => {
        setSupportTickets(res.data);
        setLoading(false);
      })
      .catch(() => {
        setSupportTickets([]);
        setLoading(false);
      });
  };

  const handleDelete = (ticketID) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      axios.delete(`http://localhost:3045/support/${ticketID}`)
        .then(() => {
          fetchTickets();
        })
        .catch(() => {
          alert("Failed to delete ticket.");
        });
    }
  };

  const handleEdit = (ticketID) => {
    navigate(`/support/edit/${ticketID}`);
  };

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <h1 style={{marginBottom: '30px'}}>Edit Support Tickets</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
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
                  <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                    <button className="button-primary" onClick={() => handleEdit(ticket.ticketID || ticket.id || ticket._id)}>Edit</button>
                    <button className="button-danger" onClick={() => handleDelete(ticket.ticketID || ticket.id || ticket._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <button type="button" className="button-primary" style={{marginTop: '30px', maxWidth: '300px'}} onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default SupportEditList;
