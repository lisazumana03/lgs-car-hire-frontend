import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableCars } from '../../../services/carService';
import './CarSelection.css';

function CarSelection() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [priceSort, setPriceSort] = useState('none');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAvailableCars();
            setCars(response.data || []);
        } catch (err) {
            console.error('Error fetching cars:', err);
            setError('Failed to load cars. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookCar = (car) => {
        // Navigate to booking form with pre-filled car data
        navigate('/make-booking', {
            state: { 
                selectedCar: {
                    carID: car.carID,
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    rentalPrice: car.rentalPrice,
                    imageUrl: car.imageUrl
                }
            }
        });
    };

    // Get unique brands for filter
    const brands = [...new Set(cars.map(car => car.brand))];

    // Filter and sort cars
    let filteredCars = cars.filter(car => {
        const matchesSearch = 
            car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
        
        return matchesSearch && matchesBrand;
    });

    // Sort by price
    if (priceSort === 'low-high') {
        filteredCars.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (priceSort === 'high-low') {
        filteredCars.sort((a, b) => b.rentalPrice - a.rentalPrice);
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading available cars...</p>
            </div>
        );
    }

    return (
        <div className="car-selection-container">
            <div className="car-selection-wrapper">
                {/* Header */}
                <div className="selection-header">
                    <h1 className="selection-title">Choose Your Perfect Car</h1>
                    <p className="selection-subtitle">Select from our premium fleet of luxury vehicles</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Search and Filter Section */}
                <div className="filters-container">
                    <div className="filters-grid">
                        {/* Search Bar */}
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by brand or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Brand Filter */}
                        <div className="filter-group">
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Sort */}
                        <div className="filter-group">
                            <select
                                value={priceSort}
                                onChange={(e) => setPriceSort(e.target.value)}
                                className="filter-select"
                            >
                                <option value="none">Sort by Price</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="results-section">
                        <span className="results-count">
                            {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
                        </span>
                    </div>
                </div>

                {/* Cars Grid */}
                {filteredCars.length === 0 ? (
                    <div className="no-results">
                        <p className="no-results-text">No cars found matching your criteria</p>
                        <p className="no-results-subtext">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="cars-grid">
                        {filteredCars.map(car => (
                            <div key={car.carID} className="car-card">
                                {/* Car Image */}
                                <div className="car-image-container">
                                    {car.imageUrl ? (
                                        <img 
                                            src={car.imageUrl} 
                                            alt={`${car.brand} ${car.model}`}
                                            className="car-image"
                                        />
                                    ) : (
                                        <svg className="car-placeholder-icon" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                        </svg>
                                    )}
                                </div>

                                {/* Car Details */}
                                <div className="car-details">
                                    {/* Header */}
                                    <div className="car-header">
                                        <h3 className="car-title">
                                            {car.brand} {car.model}
                                        </h3>
                                        <div className="car-meta">
                                            <p className="car-year">{car.year}</p>
                                            <span className="car-separator">•</span>
                                            <p className="car-id">ID: {car.carID}</p>
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div className="car-specs">
                                        <div className="spec-item">
                                            <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            {car.carTypeName || 'Standard'}
                                        </div>
                                        <div className="spec-item">
                                            <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
                                            {car.carTypeFuelType || 'Petrol'}
                                        </div>
                                        <div className="spec-item">
                                            <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            {car.carTypeNumberOfSeats || '5'} Seats
                                        </div>
                                    </div>

                                    {/* Availability Badge */}
                                    <div className="car-badges">
                                        {car.availability ? (
                                            <span className="badge badge-available">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="badge badge-rented">
                                                Rented
                                            </span>
                                        )}
                                    </div>

                                    {/* Price and Book Button */}
                                    <div className="car-footer">
                                        <div className="price-section">
                                            <p className="car-price">
                                                R{car.rentalPrice}
                                            </p>
                                            <p className="price-unit">per day</p>
                                        </div>
                                        <button
                                            onClick={() => handleBookCar(car)}
                                            disabled={!car.availability}
                                            className={`book-button ${car.availability ? 'available' : 'unavailable'}`}
                                        >
                                            {car.availability ? 'Book Now' : 'Not Available'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="back-section">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="back-button"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarSelection;
