/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

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
                // Invoice not found
                setInvoice(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    const handlePrint = () => {
        window.print();
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

    // Safety check for rental duration calculation
    const rentalDays = invoice.booking && invoice.booking.startDate && invoice.booking.endDate ?
        Math.ceil((new Date(invoice.booking.endDate) - new Date(invoice.booking.startDate)) / (1000 * 60 * 60 * 24)) || 1 :
        1;

    // Safety check for daily rate calculation
    const dailyRate = invoice.booking ?
        (invoice.subTotal / rentalDays).toFixed(2) :
        invoice.subTotal.toFixed(2);

    // Get car model safely
    const carModel = invoice.booking?.cars?.[0]?.model || 'Vehicle';

    return (
        <div className="form">
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button
                    onClick={handlePrint}
                    className="submit-btn"
                    style={{ padding: '10px 20px', marginRight: '10px' }}
                >
                    Print Invoice
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

                {/* Client Information */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Bill To:</h3>
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        {invoice.booking?.user?.name || 'Customer Name'}
                    </p>
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        {invoice.booking?.user?.email || 'customer@email.com'}
                    </p>
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        {invoice.booking?.pickupLocation || 'Pickup Location'}
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
                                R{invoice.subTotal.toFixed(2)}
                            </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                Subtotal:
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                R{invoice.subTotal.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                Tax (15%):
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                R{invoice.taxAmount.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1em' }}>
                                Total:
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1em', color: '#007bff' }}>
                                R{invoice.totalAmount.toFixed(2)}
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
                    {invoice.status === 'PAID' && invoice.payment?.paymentDate && (
                        <p style={{ margin: '5px 0 0 0', color: '#155724' }}>
                            Paid on {new Date(invoice.payment.paymentDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid #ddd',
                    color: '#666'
                }}>
                    <p>Thank you for your business!</p>
                    <p>Payment is due by {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;