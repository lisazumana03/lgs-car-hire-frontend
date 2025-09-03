import React from "react";
import { useNavigate } from "react-router-dom";

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

const SupportList = () => (
  <div className="main-content">
    <div className="dashboard-container">
      <h1 style={{marginBottom: '30px'}}>Support Tickets</h1>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
        {supportTickets.map((ticket) => (
          <div key={ticket.id} className="stat-card" style={{backgroundColor: '#3a3a3a', color: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '25px', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
              <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginRight: '15px', boxShadow: '0 2px 8px rgba(0,123,255,0.2)'}}>
                {ticket.name.charAt(0)}
              </div>
              <div>
                <span style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#4ade80'}}>{ticket.name}</span>
              </div>
            </div>
            <div style={{marginBottom: '10px'}}>
              <span style={{color: '#FFD700', fontSize: '1.05rem', fontWeight: 'bold'}}>Problem:</span>
              <span style={{color: 'white', fontSize: '1rem', marginLeft: '8px'}}>{ticket.problem}</span>
            </div>
          </div>
        ))}
      </div>
  <button type="button" className="button-primary" style={{marginTop: '30px', maxWidth: '300px'}} onClick={() => navigate(-1)}>Back</button>
    </div>
  </div>
);


export default SupportList;