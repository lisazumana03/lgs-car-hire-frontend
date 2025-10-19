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
            // Get user ID from localStorage user object
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            let userId = null;
            
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user.userId || user.id || user.userID;
                    console.log('User object:', user);
                    console.log('Extracted user ID:', userId);
                } catch (error) {
                    console.error('Error parsing user from storage:', error);
                }
            }
            
            if (!userId) {
                console.warn('No user ID found, trying fallback methods...');
                // Try other possible keys
                userId = localStorage.getItem('userId') || localStorage.getItem('userID') || '1';
            }
            
            console.log('Fetching invoices for user:', userId);

            const invoiceData = await invoiceService.getUserInvoices(userId);
            console.log('Invoices fetched:', invoiceData);
            setInvoices(invoiceData);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Failed to load invoices: ' + err.message);

            // Fallback: try to get all invoices
            try {
                console.log('Trying fallback: get all invoices...');
                const allInvoices = await invoiceService.getAllInvoices();
                console.log('All invoices fetched:', allInvoices);
                setInvoices(allInvoices);
                setError('');
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                setError('Failed to load invoices. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const createTestInvoice = async () => {
        try {
            console.log('Creating test invoice...');
            
            // Get user ID
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
            let userId = null;
            
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user.userId || user.id || user.userID;
                } catch (error) {
                    console.error('Error parsing user from storage:', error);
                }
            }
            
            if (!userId) {
                userId = '1'; // Fallback
            }

            const testInvoiceData = {
                userId: userId,
                subTotal: 500.00,
                taxAmount: 75.00,
                totalAmount: 575.00,
                issueDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                status: 'PENDING',
                carModel: 'Test Car Model'
            };

            console.log('Test invoice data:', testInvoiceData);
            
            const createdInvoice = await invoiceService.create(testInvoiceData);
            console.log('Test invoice created:', createdInvoice);
            
            // Refresh the invoice list
            await fetchInvoices();
            
            alert('Test invoice created successfully!');
        } catch (error) {
            console.error('Error creating test invoice:', error);
            alert('Failed to create test invoice: ' + error.message);
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

            {/* Debug Information */}
            <div style={{
                backgroundColor: '#f8f9fa',
                color: '#495057',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '20px',
                fontSize: '12px',
                fontFamily: 'monospace'
            }}>
                <strong>Debug Info:</strong><br/>
                Invoices count: {invoices.length}<br/>
                Invoices data: {JSON.stringify(invoices, null, 2)}
            </div>

            {invoices.length === 0 ? (
                <div className="message info" style={{
                    backgroundColor: '#d1ecf1',
                    color: '#0c5460',
                    padding: '15px',
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
                    No invoices found. This could mean:
                    <ul style={{textAlign: 'left', marginTop: '10px'}}>
                        <li>No invoices exist for this user</li>
                        <li>User ID is incorrect</li>
                        <li>Backend API is not responding</li>
                        <li>Authentication issues</li>
                    </ul>
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

            {/* Test Invoice Creation Button */}
            <button
                className="submit-btn"
                onClick={createTestInvoice}
                style={{ 
                    marginTop: '10px', 
                    marginLeft: '10px',
                    backgroundColor: '#28a745'
                }}
            >
                Create Test Invoice
            </button>
        </div>
    );
};

export default InvoiceList;