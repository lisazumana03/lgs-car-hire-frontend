/*
Booking Details Page
Shows detailed information about a specific booking
*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { read, getAllBookings } from '../../../services/bookingService';
import Footer from '../../Common/Footer';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
      
      // Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token present:', token ? 'Yes' : 'No');
      
      const response = await read(id);
      console.log('Booking response:', response);
      console.log('Booking data:', response.data);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 403) {
        setError('Access denied: You do not have permission to view this booking. This may be a backend permission issue.');
      } else if (error.response?.status === 401) {
        setError('Authentication required: Please log in again.');
      } else {
        setError(`Failed to load booking details: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching all bookings...');
      const response = await getAllBookings();
      console.log('All bookings response:', response);
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
    
    // Check if coordinates are available (latitude and longitude)
    if (location.latitude && location.longitude) {
      // Use coordinates for precise location
      mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      console.log(`Opening maps with coordinates: ${location.latitude}, ${location.longitude}`);
    } 
    // Fallback to address search
    else {
      let address = '';
      
      if (typeof location === 'string') {
        address = location;
      } else if (location.fullAddress) {
        address = location.fullAddress;
      } else if (location.streetName) {
        // Build address from components
        address = [
          location.locationName,
          location.streetName,
          location.cityOrTown,
          location.provinceOrState,
          location.country
        ].filter(Boolean).join(', ');
      } else if (location.locationName) {
        address = location.locationName;
      } else if (location.address) {
        address = location.address;
      } else if (location.name) {
        address = location.name;
      }
      
      if (address) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        console.log(`Opening maps with address search: ${address}`);
      } else {
        console.log('No valid address or coordinates found');
        alert('Location coordinates not available for this booking');
        return;
      }
    }
    
    // Open in new tab
    window.open(mapsUrl, '_blank');
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

  // If no specific booking ID, show list of bookings to choose from
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetails;
