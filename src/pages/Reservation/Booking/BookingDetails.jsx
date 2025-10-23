/*
Booking Details Page
Shows detailed information about a specific booking with invoice integration
*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { read, getAllBookings } from '../../../services/bookingService';
import invoiceService from '../../../services/invoiceService';
import Footer from '../../Common/Footer';
import './BookingDetails.css';

// Inline Invoice Component - Professional Design
const InlineInvoiceView = ({ invoice, onDownload }) => {
  if (!invoice) {
    return (
        <div className="inline-invoice-panel">
          <div className="loading-container">
            <p>Loading invoice data...</p>
          </div>
        </div>
    );
  }

  const rentalDays = invoice.bookingStartDate && invoice.bookingEndDate ?
      Math.ceil((new Date(invoice.bookingEndDate) - new Date(invoice.bookingStartDate)) / (1000 * 60 * 60 * 24)) || 1 :
      1;

  const dailyRate = rentalDays > 0 ? (invoice.subTotal / rentalDays).toFixed(2) : (invoice.subTotal || 0).toFixed(2);
  const carModel = invoice.carModel && invoice.carModel !== "Unknown" ?
      invoice.carModel :
      (invoice.booking?.cars?.[0]?.model || 'Vehicle');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
      <div className="inline-invoice-panel">
        {/* Company Header */}
        <div className="invoice-company-header">
          <div className="company-info">
            <h2>LG'S CAR HIRE</h2>
            <p>123 Rental Street, City, State 12345</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="invoice-number">
            <h3>INVOICE #{invoice.invoiceID}</h3>
            <p>Issue Date: {formatDate(invoice.issueDate)}</p>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="invoice-title-section">
            <button
                onClick={onDownload}
                className="download-invoice-btn"
            >
              Download Invoice
            </button>
          </div>
          <div className="invoice-meta">
            <p><strong>Status:</strong>
              <span className={`invoice-status-badge ${(invoice.status || 'PENDING').toLowerCase()}`}>
              {invoice.status || 'PENDING'}
            </span>
            </p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="invoice-details-grid">
          <div className="invoice-customer">
            <h4>Bill To</h4>
            <p><strong>{invoice.customerName}</strong></p>
            <p>{invoice.customerEmail}</p>
            <p>{invoice.pickupLocationName}</p>
            <p>{invoice.pickupLocationAddress}</p>
          </div>

          <div className="invoice-vehicle">
            <h4>Vehicle Details</h4>
            <p><strong>{carModel}</strong></p>
            <p>Rental Period: {rentalDays} day{rentalDays !== 1 ? 's' : ''}</p>
            <p>Daily Rate: R{dailyRate}</p>
          </div>
        </div>

        {/* Invoice Breakdown */}
        <div className="invoice-breakdown">
          <table className="invoice-table">
            <thead>
            <tr>
              <th>Description</th>
              <th>Days</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Car Rental - {carModel}</td>
              <td>{rentalDays}</td>
              <td>R{dailyRate}</td>
              <td>R{(invoice.subTotal || 0).toFixed(2)}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <td colSpan="3" className="text-right"><strong>Subtotal:</strong></td>
              <td><strong>R{(invoice.subTotal || 0).toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right"><strong>Tax (15%):</strong></td>
              <td><strong>R{(invoice.taxAmount || 0).toFixed(2)}</strong></td>
            </tr>
            <tr className="total-row">
              <td colSpan="3" className="text-right"><strong>Total Amount:</strong></td>
              <td><strong className="total-amount">R{(invoice.totalAmount || 0).toFixed(2)}</strong></td>
            </tr>
            </tfoot>
          </table>
        </div>

        {/* Invoice Notes */}
        <div className="invoice-notes">
          <p>Terms & Conditions</p>
          <ul>
            <li>R5000 deposit required upon pickup</li>
            <li>Deposit will be refunded upon safe return of the vehicle</li>
            <li>Please present this invoice during vehicle pickup</li>
          </ul>
        </div>
      </div>
  );
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [error, setError] = useState('');

  // Get payment success state from navigation
  const paymentSuccess = location.state?.paymentSuccess;
  const paymentMessage = location.state?.message;
  const paymentData = location.state?.paymentData;

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    } else {
      fetchAllBookings();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching booking details for ID:', id);

      const response = await read(id);
      console.log('Booking response:', response);
      console.log('Booking data:', response.data);
      setBooking(response.data);

      // Fetch invoices for this booking
      await fetchBookingInvoices(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      if (error.response?.status === 403) {
        setError('Access denied: You do not have permission to view this booking.');
      } else if (error.response?.status === 401) {
        setError('Authentication required: Please log in again.');
      } else {
        setError(`Failed to load booking details: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingInvoices = async (bookingData) => {
    if (!id) return;

    try {
      setInvoiceLoading(true);
      console.log('Fetching invoices for booking:', id);

      // Try multiple approaches to get invoices
      let invoiceData = [];

      // Approach 1: Get all invoices and filter by booking ID
      try {
        const allInvoices = await invoiceService.getAllInvoices();
        console.log('All invoices:', allInvoices);

        // Filter invoices for this specific booking
        invoiceData = allInvoices.filter(invoice => {
          const matchesBooking =
              invoice.bookingId === parseInt(id) ||
              invoice.booking?.bookingID === parseInt(id) ||
              invoice.booking?.id === parseInt(id) ||
              invoice.bookingID === parseInt(id);

          console.log(`Invoice ${invoice.invoiceID} matches booking ${id}:`, matchesBooking);
          return matchesBooking;
        });
      } catch (error) {
        console.log('Failed to get all invoices, trying user-specific approach:', error);

        // Approach 2: Get user invoices
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
          userId = localStorage.getItem('userId') || localStorage.getItem('userID') || '1';
        }

        const userInvoices = await invoiceService.getUserInvoices(userId);
        invoiceData = userInvoices.filter(invoice =>
            invoice.bookingId === parseInt(id) ||
            invoice.booking?.bookingID === parseInt(id) ||
            invoice.booking?.id === parseInt(id)
        );
      }

      console.log('Filtered invoices for booking:', invoiceData);
      setInvoices(invoiceData);


      if (invoiceData.length === 0 && paymentSuccess) {
        console.log('No invoices found, creating mock invoice from payment data');
        const mockInvoice = createMockInvoice(bookingData, paymentData);
        setInvoices([mockInvoice]);
      }

    } catch (error) {
      console.error('Error fetching booking invoices:', error);

      // Create mock invoice as fallback
      if (paymentSuccess) {
        console.log('Creating fallback mock invoice');
        const mockInvoice = createMockInvoice(booking, paymentData);
        setInvoices([mockInvoice]);
      }
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Create mock invoice when real invoice data is not available
  const createMockInvoice = (bookingData, paymentData) => {
    const bookingId = bookingData?.id || bookingData?.bookingID || id;
    const rentalPrice = bookingData?.car?.rentalPrice || 500;
    const startDate = bookingData?.startDate || new Date().toISOString();
    const endDate = bookingData?.endDate || new Date(Date.now() + 86400000).toISOString();

    const rentalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const subTotal = rentalPrice * rentalDays;
    const taxAmount = subTotal * 0.15;
    const totalAmount = subTotal + taxAmount;

    return {
      invoiceID: `${bookingId}`,
      bookingId: parseInt(bookingId),
      issueDate: new Date().toISOString(),
      Date: endDate,
      customerName: bookingData?.user?.firstName + ' ' + bookingData?.user?.lastName || 'Customer',
      customerEmail: bookingData?.user?.email || 'customer@example.com',
      carModel: bookingData?.car?.brand + ' ' + bookingData?.car?.model || 'Vehicle',
      pickupLocationName: bookingData?.pickupLocation?.locationName || 'Pickup Location',
      pickupLocationAddress: bookingData?.pickupLocation?.streetName + ', ' + bookingData?.pickupLocation?.cityOrTown || 'Address',
      subTotal: subTotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      status: paymentData?.status || 'PAID',
      bookingStartDate: startDate,
      bookingEndDate: endDate,
      isMock: true
    };
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setAllBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      setError(`Failed to load bookings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const openInMaps = (location, type) => {
    if (!location) {
      console.log('No location data available');
      return;
    }

    let mapsUrl = '';

    if (location.latitude && location.longitude) {
      mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    } else {
      let address = '';

      if (typeof location === 'string') {
        address = location;
      } else if (location.fullAddress) {
        address = location.fullAddress;
      } else if (location.streetName) {
        address = [
          location.locationName,
          location.streetName,
          location.cityOrTown,
          location.provinceOrState,
          location.country
        ].filter(Boolean).join(', ');
      } else if (location.locationName) {
        address = location.locationName;
      }

      if (address) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      } else {
        alert('Location coordinates not available for this booking');
        return;
      }
    }

    window.open(mapsUrl, '_blank');
  };

  // Download Invoice Function
  const handleDownloadInvoice = (invoice) => {
    const rentalDays = invoice.bookingStartDate && invoice.bookingEndDate ?
        Math.ceil((new Date(invoice.bookingEndDate) - new Date(invoice.bookingStartDate)) / (1000 * 60 * 60 * 24)) || 1 :
        1;

    const dailyRate = rentalDays > 0 ? (invoice.subTotal / rentalDays).toFixed(2) : (invoice.subTotal || 0).toFixed(2);

    const invoiceText = `
LG'S CAR HIRE
123 Rental Street
City, State 12345
Phone: (123) 456-7890

INVOICE #${invoice.invoiceID}
Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
Return Date: ${new Date(invoice.dueDate).toLocaleDateString()}

BILL TO:
Name: ${invoice.customerName}
Email: ${invoice.customerEmail}
Pickup Location: ${invoice.pickupLocationName}
${invoice.pickupLocationAddress}
Return Location: ${invoice.dropOffLocationName || invoice.pickupLocationName}

CAR RENTAL DETAILS:
Vehicle: ${invoice.carModel}
Rental Period: ${rentalDays} days
Daily Rate: R${dailyRate}

BREAKDOWN:
Subtotal: R${(invoice.subTotal || 0).toFixed(2)}
Tax (15%): R${(invoice.taxAmount || 0).toFixed(2)}
Total: R${(invoice.totalAmount || 0).toFixed(2)}

STATUS: ${invoice.status || 'PAID'}

NOTES:
- R5000 deposit required upon pickup
- Deposit will be refunded upon safe return of the vehicle in original condition
- Thank you for your business!
    `.trim();

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${invoice.invoiceID}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
        <div className="booking-details-container">
          <div className="booking-details-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="mt-2">Loading booking details...</p>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  if (error) {
    return (
        <div className="booking-details-container">
          <div className="booking-details-content">
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button
                  onClick={() => navigate('/bookings')}
                  className="action-button"
              >
                Back to Bookings
              </button>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  if (!id && allBookings.length > 0) {
    return (
        <div className="booking-details-container">
          <div className="booking-details-content">
            <div className="booking-list-container">
              <h1 className="booking-list-title">Select Booking to View Details</h1>
              <div className="booking-list-items">
                {allBookings.map((booking) => (
                    <div key={booking.id || booking.bookingId} className="booking-list-item">
                      <div className="booking-list-info">
                        <h3 className="booking-list-id">Booking #{booking.id || booking.bookingId}</h3>
                        <p className="booking-list-detail">Car: {booking.cars?.[0] || 'N/A'}</p>
                        <p className="booking-list-detail">Status: {booking.bookingStatus || 'Unknown'}</p>
                      </div>
                      <button
                          onClick={() => navigate(`/booking-details/${booking.id || booking.bookingId}`)}
                          className="view-details-button"
                      >
                        View Details
                      </button>
                    </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  if (!booking) {
    return (
        <div className="booking-details-container">
          <div className="booking-details-content">
            <div className="error-container">
              <p className="error-message">Booking not found</p>
              <button
                  onClick={() => navigate('/bookings')}
                  className="action-button"
              >
                Back to Bookings
              </button>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  return (
      <div className="booking-details-container">
        <div className="booking-details-content">
          {/* Page Title */}
          <h1 className="booking-details-title">Booking Details</h1>

          {/* Payment Success Banner */}
          {paymentSuccess && (
              <div className="payment-success-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="payment-success-icon">✓</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="payment-success-title">Payment Successful!</h3>
                    <p className="payment-success-message">{paymentMessage}</p>
                    {paymentData && (
                        <div className="payment-info-grid">
                          <div className="payment-info-card">
                            <p className="payment-info-label">Reference</p>
                            <p className="payment-info-value">{paymentData.reference || paymentData.paymentID}</p>
                          </div>
                          <div className="payment-info-card">
                            <p className="payment-info-label">Amount</p>
                            <p className="payment-info-value">R{paymentData.amount}</p>
                          </div>
                          <div className="payment-info-card">
                            <p className="payment-info-label">Status</p>
                            <p className="payment-info-value">{paymentData.status}</p>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}

          {/* Car Details Section */}
          <div className="booking-card car-details-card">
            <div className="car-details-grid">
              <div className="car-icon-container">
                CAR
              </div>
              <div className="car-info">
                <h2 className="car-title">
                  {booking.car?.brand || booking.car?.model || 'Vehicle Rental'}
                </h2>
                <p className="car-plate">
                  {booking.car?.numberPlate || booking.car?.licensePlate || 'License Plate: TBD'}
                </p>
                <p className="car-id">
                  Car ID: {booking.car?.carID || booking.car?.id || 'To be assigned'}
                </p>
              </div>
              <div>
                <div className="rental-status-badge">
                  <p style={{ color: '#93c5fd', fontSize: '0.875rem', fontWeight: 600 }}>Rental Status</p>
                  <p style={{ color: '#bfdbfe', fontSize: '1.125rem', fontWeight: 'bold' }}>CONFIRMED</p>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Invoice Section - Always show if payment was made */}
          {(paymentSuccess || invoices.length > 0) && (
              <div className="booking-card invoices-card">
                <h3 className="invoices-header">
                  {invoices.some(inv => inv.isMock) ? 'Payment Confirmation' : 'Booking Invoice'}
                </h3>

                {invoiceLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading invoice...</p>
                    </div>
                ) : (
                    <div className="inline-invoices-container">
                      {invoices.map((invoice) => (
                          <InlineInvoiceView
                              key={invoice.invoiceID}
                              invoice={invoice}
                              onDownload={() => handleDownloadInvoice(invoice)}
                          />
                      ))}

                      {/* Show message if no invoices but payment was successful */}
                      {invoices.length === 0 && paymentSuccess && (
                          <div className="payment-confirmation-message">
                            <h4>Payment Processed Successfully</h4>
                            <p>Your payment has been received. The invoice will be generated shortly.</p>
                            <p><strong>Reference:</strong> {paymentData?.reference}</p>
                            <p><strong>Amount:</strong> R{paymentData?.amount}</p>
                          </div>
                      )}
                    </div>
                )}
              </div>
          )}

          {/* Booking Dates Section */}
          <div className="booking-card dates-card">
            <h3 className="dates-header">Booking Dates</h3>
            <div className="dates-grid">
              <div>
                <div className="date-box">
                  <p className="date-label">PICKUP DATE</p>
                  <p className="date-value">{formatDate(booking.startDate)}</p>
                  <p className="date-time">{formatDateTime(booking.startDate)}</p>
                </div>
              </div>
              <div>
                <div className="date-box">
                  <p className="date-label">DROP-OFF DATE</p>
                  <p className="date-value">{formatDate(booking.endDate)}</p>
                  <p className="date-time">{formatDateTime(booking.endDate)}</p>
                </div>
              </div>
            </div>
            <div className="status-badge-container">
            <span className={`status-badge ${getStatusColor(booking.bookingStatus)}`}>
              {booking.bookingStatus || 'CONFIRMED'}
            </span>
            </div>
          </div>

          {/* Locations Section */}
          <div className="booking-card locations-card">
            <h3 className="locations-header">Locations</h3>

            {/* Location Details */}
            <div className="location-details-grid">
              <div className="location-detail-card">
                <h4 className="location-title">Pickup Location</h4>
                <div className="location-info">
                  <p className="location-name">{booking.pickupLocation?.locationName || 'Pickup Location'}</p>
                  <p className="location-address">{booking.pickupLocation?.streetName || 'Address details'}</p>
                  <p className="location-address">{booking.pickupLocation?.cityOrTown}, {booking.pickupLocation?.provinceOrState}</p>
                  <p className="location-address">{booking.pickupLocation?.country}</p>
                  {booking.pickupLocation?.latitude && booking.pickupLocation?.longitude && (
                      <p className="location-address" style={{ marginTop: '0.5rem', color: '#4ade80', fontSize: '0.75rem' }}>
                        GPS: {booking.pickupLocation.latitude}, {booking.pickupLocation.longitude}
                      </p>
                  )}
                </div>
              </div>
              <div className="location-detail-card">
                <h4 className="location-title">Drop-off Location</h4>
                <div className="location-info">
                  <p className="location-name">{booking.dropOffLocation?.locationName || 'Drop-off Location'}</p>
                  <p className="location-address">{booking.dropOffLocation?.streetName || 'Address details'}</p>
                  <p className="location-address">{booking.dropOffLocation?.cityOrTown}, {booking.dropOffLocation?.provinceOrState}</p>
                  <p className="location-address">{booking.dropOffLocation?.country}</p>
                  {booking.dropOffLocation?.latitude && booking.dropOffLocation?.longitude && (
                      <p className="location-address" style={{ marginTop: '0.5rem', color: '#4ade80', fontSize: '0.75rem' }}>
                        GPS: {booking.dropOffLocation.latitude}, {booking.dropOffLocation.longitude}
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* Map Action Buttons */}
            <div className="map-buttons-grid">
              <button
                  onClick={() => openInMaps(booking.pickupLocation, 'pickup')}
                  className="map-button"
                  title={booking.pickupLocation?.latitude && booking.pickupLocation?.longitude
                      ? `Open GPS coordinates: ${booking.pickupLocation.latitude}, ${booking.pickupLocation.longitude}`
                      : 'Search address in Google Maps'}
              >
                {booking.pickupLocation?.latitude && booking.pickupLocation?.longitude
                    ? 'Open Pickup GPS Location'
                    : 'Search Pickup Location'}
              </button>
              <button
                  onClick={() => openInMaps(booking.dropOffLocation, 'dropoff')}
                  className="map-button"
                  title={booking.dropOffLocation?.latitude && booking.dropOffLocation?.longitude
                      ? `Open GPS coordinates: ${booking.dropOffLocation.latitude}, ${booking.dropOffLocation.longitude}`
                      : 'Search address in Google Maps'}
              >
                {booking.dropOffLocation?.latitude && booking.dropOffLocation?.longitude
                    ? 'Open Dropoff GPS Location'
                    : 'Search Dropoff Location'}
              </button>
            </div>
          </div>

          {/* Additional Details */}
          <div className="booking-card additional-details-card">
            <h3 className="additional-details-header">Additional Details</h3>
            <div className="additional-details-grid">
              <div className="detail-card">
                <p className="detail-label">Booking ID</p>
                <p className="detail-value">#{booking.id || booking.bookingId}</p>
              </div>
              <div className="detail-card">
                <p className="detail-label">Booking Date</p>
                <p className="detail-value">{formatDate(booking.bookingDateAndTime)}</p>
                <p className="detail-subvalue">{formatDateTime(booking.bookingDateAndTime)}</p>
              </div>
              <div className="detail-card">
                <p className="detail-label">Status</p>
                <span className={`status-badge ${getStatusColor(booking.bookingStatus)}`}>
                {booking.bookingStatus || 'CONFIRMED'}
              </span>
              </div>
              <div className="detail-card">
                <p className="detail-label">Customer</p>
                <p className="detail-value">
                  {booking.user?.firstName || 'N/A'} {booking.user?.lastName || ''}
                </p>
                <p className="detail-subvalue">{booking.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
                onClick={() => navigate('/bookings')}
                className="action-button"
            >
              Back to Bookings
            </button>
            <button
                onClick={() => navigate('/dashboard')}
                className="action-button action-button-secondary"
            >
              Dashboard
            </button>
            {/* Only show Make Payment button if no payment was made */}
            {!paymentSuccess && invoices.length === 0 && (
                <button
                    onClick={() => navigate('/payment', { state: { booking } })}
                    className="action-button action-button-tertiary"
                    style={{ backgroundColor: '#28a745' }}
                >
                  Make Payment
                </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default BookingDetails;