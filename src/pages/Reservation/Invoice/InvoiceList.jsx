import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../../../services/invoiceService';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            // Use current user ID or a default one for testing
            const invoiceData = await invoiceService.getUserInvoices('current-user-id');
            setInvoices(invoiceData);
        } catch (err) {
            setError('Failed to load invoices');
            console.error('Error fetching invoices:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="form">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>Loading invoices...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="form">
            <h1>My Invoices</h1>

            {error && (
                <div className="message error">{error}</div>
            )}

            {invoices.length === 0 ? (
                <div className="message info">
                    No invoices found.
                </div>
            ) : (
                <div className="invoice-list">
                    {invoices.map((invoice) => (
                        <div key={invoice.invoiceID} className="invoice-item"
                             style={{
                                 backgroundColor: '#3a3a3a',
                                 padding: '20px',
                                 borderRadius: '8px',
                                 marginBottom: '15px',
                                 cursor: 'pointer',
                                 transition: 'transform 0.2s ease'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                             onClick={() => navigate(`/invoice/${invoice.invoiceID}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: 'white', marginBottom: '10px' }}>
                                        Invoice #{invoice.invoiceID}
                                    </h3>
                                    <p style={{ color: '#aaa', margin: '5px 0' }}>
                                        Date: {new Date(invoice.issueDate).toLocaleDateString()}
                                    </p>
                                    <p style={{ color: '#aaa', margin: '5px 0' }}>
                                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                    </p>
                                    <p style={{ color: 'white', margin: '5px 0', fontWeight: 'bold' }}>
                                        Amount: R{invoice.totalAmount?.toFixed(2)}
                                    </p>
                                </div>
                                <div style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    backgroundColor: invoice.status === 'PAID' ? '#28a745' : '#ffc107',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {invoice.status}
                                </div>
                            </div>
                            {invoice.booking?.cars?.[0]?.model && (
                                <p style={{ color: '#ccc', marginTop: '10px', marginBottom: '0' }}>
                                    Vehicle: {invoice.booking.cars[0].model}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button
                className="submit-btn"
                onClick={() => navigate('/dashboard')}
                style={{ marginTop: '20px' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default InvoiceList;