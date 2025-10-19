import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import invoiceService from '../../../services/invoiceService';

const InvoiceView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const invoiceData = await invoiceService.read(id);
                setInvoice(invoiceData);
            } catch (err) {
                setError('Failed to fetch invoice');
                console.error('Error fetching invoice:', err);
                setInvoice(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    const handleDownload = async () => {
        try {
            const blob = await invoiceService.downloadInvoice(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            setError('Failed to download invoice: ' + err.message);

            // Fallback: Create a simple text download
            const invoiceText = `
INVOICE #${invoice.invoiceID}
Date: ${new Date(invoice.issueDate).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Subtotal: R${invoice.subTotal?.toFixed(2) || '0.00'}
Tax: R${invoice.taxAmount?.toFixed(2) || '0.00'}
Total: R${invoice.totalAmount?.toFixed(2) || '0.00'}
Status: ${invoice.status}
Car: ${invoice.carModel || 'Vehicle'}
            `.trim();

            const blob = new Blob([invoiceText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.txt`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    };

    if (loading) {
        return (
            <div className="form">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>Loading invoice...</h2>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="form">
                <div className="error-container">
                    <h2>Invoice Not Found</h2>
                    <p>{error || 'The requested invoice could not be found.'}</p>
                    <button
                        className="submit-btn"
                        onClick={() => navigate('/dashboard')}
                        style={{marginTop: '20px'}}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Calculate rental days based on issue date and due date (since we don't have booking dates)
    const rentalDays = invoice.issueDate && invoice.dueDate ?
        Math.ceil((new Date(invoice.dueDate) - new Date(invoice.issueDate)) / (1000 * 60 * 60 * 24)) || 1 :
        1;

    const dailyRate = rentalDays > 0 ? (invoice.subTotal / rentalDays).toFixed(2) : invoice.subTotal.toFixed(2);

    // Use the carModel from the DTO
    const carModel = invoice.carModel && invoice.carModel !== "Unknown" ? invoice.carModel : 'Vehicle';

    return (
        <div className="form">
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button
                    onClick={() => {
                        console.log('Full invoice object:', invoice);
                        // Try multiple possible field names for booking ID
                        const bookingId = invoice.bookingId 
                            || invoice.booking?.bookingID 
                            || invoice.booking?.id 
                            || invoice.bookingID
                            || invoice.booking_id;
                        
                        console.log('Extracted booking ID:', bookingId);
                        
                        if (bookingId) {
                            console.log('Navigating to:', `/booking-details/${bookingId}`);
                            navigate(`/booking-details/${bookingId}`);
                        } else {
                            alert('Booking ID not available in invoice. Your InvoiceDTO may need to include bookingId field.');
                            console.error('Invoice structure:', JSON.stringify(invoice, null, 2));
                        }
                    }}
                    className="submit-btn"
                    style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#007bff' }}
                >
                    View Booking Details
                </button>
                <button
                    onClick={handleDownload}
                    className="submit-btn"
                    style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#28a745' }}
                >
                    Download Invoice
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="submit-btn"
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d' }}
                >
                    Back to Dashboard
                </button>
            </div>

            <div style={{
                backgroundColor: '#fff',
                color: '#000',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}>
                {/* Invoice Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '2px solid #007bff'
                }}>
                    <div>
                        <h2 style={{ color: '#007bff', margin: '0 0 10px 0' }}>LG'S CAR HIRE</h2>
                        <p style={{ margin: '2px 0', color: '#666' }}>123 Rental Street</p>
                        <p style={{ margin: '2px 0', color: '#666' }}>City, State 12345</p>
                        <p style={{ margin: '2px 0', color: '#666' }}>Phone: (123) 456-7890</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <h1 style={{ color: '#007bff', margin: '0 0 10px 0' }}>INVOICE</h1>
                        <p style={{ margin: '2px 0', color: '#666' }}>
                            <strong>Invoice #:</strong> {invoice.invoiceID}
                        </p>
                        <p style={{ margin: '2px 0', color: '#666' }}>
                            <strong>Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}
                        </p>
                        <p style={{ margin: '2px 0', color: '#666' }}>
                            <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Client Information - Simplified since we don't have user data in DTO */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Bill To:</h3>
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        Customer
                    </p>
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        customer@email.com
                    </p>
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        Pickup Location
                    </p>
                </div>

                {/* Invoice Items */}
                <div style={{ marginBottom: '30px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Days</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Rate</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>
                                Car Rental - {carModel}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                {rentalDays}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                R{dailyRate}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                R{invoice.subTotal?.toFixed(2) || '0.00'}
                            </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                Subtotal:
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                R{invoice.subTotal?.toFixed(2) || '0.00'}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                Tax (15%):
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                R{invoice.taxAmount?.toFixed(2) || '0.00'}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1em' }}>
                                Total:
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1em', color: '#007bff' }}>
                                R{invoice.totalAmount?.toFixed(2) || '0.00'}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Payment Status */}
                <div style={{
                    padding: '15px',
                    backgroundColor: invoice.status === 'PAID' ? '#d4edda' : '#fff3cd',
                    border: `1px solid ${invoice.status === 'PAID' ? '#c3e6cb' : '#ffeaa7'}`,
                    borderRadius: '4px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <strong style={{ color: invoice.status === 'PAID' ? '#155724' : '#856404' }}>
                        {invoice.status === 'PAID' ? 'PAID' : 'PENDING PAYMENT'}
                    </strong>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid #ddd',
                    color: '#666'
                }}>
                    <p>Thank you for your business!</p>
                    <p>Deposit due date is due by {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;