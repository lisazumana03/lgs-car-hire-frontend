import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoiceById } from '../../../services/invoiceService';
import Footer from '../../Common/Footer';
import './InvoicePage.css';

const InvoiceView = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await getInvoiceById(id);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="invoice-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading invoice...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="invoice-container">
        <div className="error-container">
          <p className="error-message">{error || 'Invoice not found'}</p>
          <button onClick={() => navigate('/invoices')} className="action-button">
            Back to Invoices
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <div className="invoice-content">
        <div className="invoice-header">
          <h1 className="invoice-title">Invoice Details</h1>
          <div className="invoice-actions">
            <button onClick={handlePrint} className="print-button">
              Print Invoice
            </button>
            <button onClick={() => navigate('/invoices')} className="back-button">
              Back to Invoices
            </button>
          </div>
        </div>

        {user && (
          <p className="user-info">
            Logged in as: {user.firstName} {user.lastName} ({user.role})
          </p>
        )}

        <div className="invoice-details">
          <div className="invoice-section">
            <h2>Invoice Information</h2>
            <div className="invoice-info-grid">
              <div className="info-item">
                <label>Invoice Number:</label>
                <span>#{invoice.invoiceID || invoice.id}</span>
              </div>
              <div className="info-item">
                <label>Invoice Date:</label>
                <span>{new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={`status ${invoice.status?.toLowerCase()}`}>
                  {invoice.status || 'Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>Total Amount:</label>
                <span className="amount">R{invoice.totalAmount || invoice.amount}</span>
              </div>
            </div>
          </div>

          {invoice.booking && (
            <div className="invoice-section">
              <h2>Booking Information</h2>
              <div className="invoice-info-grid">
                <div className="info-item">
                  <label>Booking ID:</label>
                  <span>#{invoice.booking.bookingID || invoice.booking.id}</span>
                </div>
                <div className="info-item">
                  <label>Start Date:</label>
                  <span>{new Date(invoice.booking.startDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>End Date:</label>
                  <span>{new Date(invoice.booking.endDate).toLocaleDateString()}</span>
                </div>
                {invoice.booking.car && (
                  <div className="info-item">
                    <label>Vehicle:</label>
                    <span>{invoice.booking.car.brand} {invoice.booking.car.model} ({invoice.booking.car.year})</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {invoice.payment && (
            <div className="invoice-section">
              <h2>Payment Information</h2>
              <div className="invoice-info-grid">
                <div className="info-item">
                  <label>Payment ID:</label>
                  <span>#{invoice.payment.paymentID || invoice.payment.id}</span>
                </div>
                <div className="info-item">
                  <label>Payment Method:</label>
                  <span>{invoice.payment.paymentMethod || 'Credit Card'}</span>
                </div>
                <div className="info-item">
                  <label>Payment Status:</label>
                  <span className={`status ${invoice.payment.status?.toLowerCase()}`}>
                    {invoice.payment.status || 'Completed'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Payment Date:</label>
                  <span>{new Date(invoice.payment.paymentDate || invoice.payment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvoiceView;
