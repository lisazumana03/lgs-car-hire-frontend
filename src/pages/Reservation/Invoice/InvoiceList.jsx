import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInvoices } from '../../../services/invoiceService';
import Footer from '../../Common/Footer';
import './InvoicePage.css';

const InvoiceList = ({ user }) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await getAllInvoices();
      setInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="invoice-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading invoices...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchInvoices} className="retry-button">
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <div className="invoice-content">
        <h1 className="invoice-title">Invoices</h1>
        
        {user && (
          <p className="user-info">
            Logged in as: {user.firstName} {user.lastName} ({user.role})
          </p>
        )}

        {invoices.length === 0 ? (
          <div className="no-invoices">
            <p>No invoices found.</p>
            <button onClick={() => navigate('/bookings')} className="action-button">
              View Bookings
            </button>
          </div>
        ) : (
          <div className="invoice-list">
            {invoices.map((invoice) => (
              <div key={invoice.invoiceID || invoice.id} className="invoice-item">
                <div className="invoice-info">
                  <h3 className="invoice-id">Invoice #{invoice.invoiceID || invoice.id}</h3>
                  <p className="invoice-detail">Booking: #{invoice.booking?.bookingID || invoice.bookingID}</p>
                  <p className="invoice-detail">Amount: R{invoice.totalAmount || invoice.amount}</p>
                  <p className="invoice-detail">Status: {invoice.status || 'Pending'}</p>
                  <p className="invoice-detail">Date: {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => navigate(`/invoices/${invoice.invoiceID || invoice.id}`)}
                  className="view-invoice-button"
                >
                  View Invoice
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InvoiceList;
