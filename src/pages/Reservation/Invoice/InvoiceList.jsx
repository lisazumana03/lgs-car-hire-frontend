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
            // Get actual user ID from localStorage or context
            const userId = localStorage.getItem('userId') || '1'; // Fallback to 1 for testing
            console.log('Fetching invoices for user:', userId);

            const invoiceData = await invoiceService.getUserInvoices(userId);
            console.log('Invoices fetched:', invoiceData);
            setInvoices(invoiceData);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Failed to load invoices: ' + err.message);

            // Fallback: try to get all invoices
            try {
                const allInvoices = await invoiceService.getAllInvoices();
                setInvoices(allInvoices);
                setError('');
            } catch (fallbackError) {
                setError('Failed to load invoices. Please try again later.');
            }
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
                <div className="message error" style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {invoices.length === 0 ? (
                <div className="message info" style={{
                    backgroundColor: '#d1ecf1',
                    color: '#0c5460',
                    padding: '15px',
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
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
                                 transition: 'transform 0.2s ease',
                                 border: '1px solid #555'
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
                                        Amount: R{invoice.totalAmount?.toFixed(2) || '0.00'}
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
                                    {invoice.status || 'PENDING'}
                                </div>
                            </div>
                            {invoice.carModel && invoice.carModel !== "Unknown" && (
                                <p style={{ color: '#ccc', marginTop: '10px', marginBottom: '0' }}>
                                    Vehicle: {invoice.carModel}
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