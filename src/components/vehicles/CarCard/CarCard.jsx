import { useState } from 'react';
import { getImageUrl, getStatusLabel, CAR_STATUS } from '../../../models/car.model';
import { getCategoryLabel, getFuelTypeLabel, getTransmissionLabel } from '../../../models/carType.model';
import './CarCard.css';

function CarCard({ car, onBook, showDetails = false }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(car);
  const isAvailable = car.status === CAR_STATUS.AVAILABLE;
  const statusLabel = getStatusLabel(car.status);

  return (
    <div className="modern-car-card">
      {/* Image Section */}
      <div className="card-image-wrapper">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="card-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="card-image-placeholder">
            <svg className="placeholder-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="card-status-badge">
          <span className={`status-pill ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">
            {car.brand} {car.model}
          </h3>
          {car.carTypeCategory && (
            <span className="category-badge">
              {getCategoryLabel(car.carTypeCategory)}
            </span>
          )}
        </div>

        <div className="card-meta">
          <span className="meta-year">{car.year}</span>
          {car.color && (
            <>
              <span className="meta-dot">•</span>
              <span className="meta-color">{car.color}</span>
            </>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="specs-grid">
          {car.carTypeTransmissionType && (
            <div className="spec-item">
              <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
              <span className="spec-label">{getTransmissionLabel(car.carTypeTransmissionType)}</span>
            </div>
          )}

          {car.carTypeFuelType && (
            <div className="spec-item">
              <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="spec-label">{getFuelTypeLabel(car.carTypeFuelType)}</span>
            </div>
          )}

          {car.carTypeNumberOfSeats && (
            <div className="spec-item">
              <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span className="spec-label">{car.carTypeNumberOfSeats} Seats</span>
            </div>
          )}

          {car.carTypeAirConditioned && (
            <div className="spec-item">
              <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
              <span className="spec-label">AC</span>
            </div>
          )}
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="additional-details">
            {car.mileage > 0 && (
              <div className="detail-row">
                <span className="detail-label">Mileage:</span>
                <span className="detail-value">{car.mileage.toLocaleString()} km</span>
              </div>
            )}
            {car.currentLocationName && (
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{car.currentLocationName}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer with Action */}
        <div className="card-footer">
          {/* Pricing Section */}
          {car.dailyRate && (
            <div className="price-section">
              <div className="price-main">
                <span className="currency">R</span>
                <span className="price-amount">{car.dailyRate.toFixed(2)}</span>
              </div>
              <span className="price-period">per day</span>
            </div>
          )}

          {onBook && (
            <button
              onClick={() => onBook(car.carID)}
              disabled={!isAvailable}
              className={`book-btn ${isAvailable ? 'book-btn-enabled' : 'book-btn-disabled'}`}
            >
              {isAvailable ? 'Book Now' : 'Not Available'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarCard;
