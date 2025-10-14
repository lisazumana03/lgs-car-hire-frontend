
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupportList = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTickets = () => {
    setLoading(true);
    axios.get("http://localhost:3045/support/all")
      .then((res) => {
        setSupportTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setSupportTickets([]);
        setError('Failed to load support tickets.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="main-content" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(120deg, #232526 0%, #414345 100%)'}}>
      <div className="dashboard-container" style={{width: '100%', maxWidth: '900px', background: 'rgba(30, 41, 59, 0.98)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: '2.5rem', marginTop: '2rem'}}>
        <h1 style={{marginBottom: '30px', color: '#fff', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px'}}>Support Tickets</h1>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px'}}>
          <button onClick={() => navigate(-1)} style={{padding: '8px 18px', background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Back</button>
          <button onClick={fetchTickets} style={{padding: '8px 18px', background: 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Refresh</button>
        </div>
        {loading && <p style={{color: '#fff', textAlign: 'center'}}>Loading support tickets...</p>}
        {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginTop: '2rem'}}>
          {supportTickets.length === 0 && !loading ? (
            <div style={{color: '#fff', textAlign: 'center', fontSize: '1.2rem'}}>No support tickets found.</div>
          ) : (
            supportTickets.map((ticket) => (
              <div key={ticket.ticketID || ticket.id || ticket._id} style={{background: 'linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)', borderRadius: '22px', boxShadow: '0 8px 32px rgba(30,41,59,0.18)', margin: '0 auto', maxWidth: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: '40px', border: '1px solid #e5e7eb'}}>
                <div style={{background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', padding: '26px 36px', display: 'flex', alignItems: 'center', borderTopLeftRadius: '22px', borderTopRightRadius: '22px'}}>
                  <div style={{flex: 1}}>
                    <span style={{fontWeight: 'bold', fontSize: '1.35rem', color: '#fff', letterSpacing: '0.5px'}}>{ticket.subject || 'No Subject'}</span>
                    <span style={{display: 'block', fontSize: '1rem', color: '#e0e7ef', marginTop: '2px'}}>Ticket ID: {ticket.ticketID || ticket.id || ticket._id}</span>
                  </div>
                </div>
                <div style={{background: '#f1f5f9', padding: '22px 36px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center'}}>
                  <div style={{flex: 1}}>
                    <span style={{fontWeight: 'bold', color: '#2563eb', fontSize: '1.12rem'}}>User ID: </span>
                    <span style={{color: '#334155', fontSize: '1.12rem', fontWeight: '500'}}>{(ticket.user && (ticket.user.userId || ticket.user.id)) || ticket.userId || ticket.user_id || ticket.userID || 'N/A'}</span>
                    {((ticket.user && (ticket.user.fullName || ticket.user.name)) || ticket.fullName || ticket.name) && (
                      <span style={{marginLeft: '18px', color: '#2563eb', fontWeight: 'bold', fontSize: '1.12rem'}}>
                        Name: <span style={{color: '#334155', fontWeight: '500'}}>{(ticket.user && (ticket.user.fullName || ticket.user.name)) || ticket.fullName || ticket.name}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div style={{padding: '28px 36px', background: '#fff', borderBottomLeftRadius: '22px', borderBottomRightRadius: '22px'}}>
                  <span style={{fontWeight: 'bold', color: '#2563eb', fontSize: '1.12rem'}}>Description: </span>
                  <span style={{color: '#334155', fontSize: '1.12rem', fontWeight: '500'}}>{ticket.description || ticket.problem || ticket.issue || 'No description provided.'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportList;