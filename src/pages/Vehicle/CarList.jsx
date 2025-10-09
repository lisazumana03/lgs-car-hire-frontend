import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars, getAvailableCars } from "../../services/carService.js";
import "./CarList.css";

/*
Imtiyaaz Waggie 219374759
Updated to support imageUrl from backend
*/

function CarCard({ car, onBook }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="car-list-car-card">
            {/* Car Image */}
            <div className="car-image-container">
                {car.imageUrl && !imageError ? (
                    <img 
                        src={car.imageUrl} 
                        alt={`${car.brand} ${car.model}`}
                        className="car-image"
                        onError={() => setImageError(true)}
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

                {/* Badges */}
                <div className="car-badges">
                    {car.insuranceID && (
                        <span className="badge badge-insurance">
                            Insurance
                        </span>
                    )}
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
                        onClick={() => onBook(car)}
                        disabled={!car.availability}
                        className={`book-button ${car.availability ? 'available' : 'unavailable'}`}
                    >
                        {car.availability ? 'Book Now' : 'Not Available'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CarView() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [priceSort, setPriceSort] = useState("none");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, [showOnlyAvailable]);

    const fetchCars = async () => {
        setLoading(true);
        setError("");
        try {
            const response = showOnlyAvailable
                ? await getAvailableCars()
                : await getAllCars();
            setCars(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError("Unable to load cars. Please try again later.");
            setLoading(false);
            setCars([]);
        }
    };

    const brands = [...new Set(cars.map(car => car.brand))];
    const types = [...new Set(cars.map(car => car.carTypeName).filter(Boolean))];

    let filteredCars = cars.filter(car => {
        const matchesSearch =
            car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;
        const matchesType = selectedType === "all" || car.carTypeName === selectedType;

        return matchesSearch && matchesBrand && matchesType;
    });

    if (priceSort === "low-high") {
        filteredCars.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (priceSort === "high-low") {
        filteredCars.sort((a, b) => b.rentalPrice - a.rentalPrice);
    }

    if (loading) {
        return (
            <div className="car-list-loading-container">
                <div className="car-list-loading-spinner"></div>
                <p className="car-list-loading-text">Loading cars...</p>
            </div>
        );
    }

    return (
        <div className="car-list-container">
            <div className="car-list-wrapper">
                {error && (
                    <div className="car-list-error-message">
                        {error}
                    </div>
                )}

                {/* Search/Filter Section */}
                <div className="car-list-filters-container">
                    <div className="car-list-filters-grid">
                        {/* Search Bar */}
                        <div className="car-list-search-box">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by brand or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Brand Filter */}
                        <div className="car-list-filter-group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H9L11 8H20C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                            >
                                <option value="all">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div className="car-list-filter-group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 10H6.01M10 14H18M6 14H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Sort */}
                        <div className="car-list-filter-group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H21M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <select
                                value={priceSort}
                                onChange={(e) => setPriceSort(e.target.value)}
                            >
                                <option value="none">Sort by Price</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Available Only Toggle */}
                    <div className="toggle-section">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={showOnlyAvailable}
                                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                className="toggle-checkbox"
                            />
                            <span className="toggle-text">Show available cars only</span>
                        </label>
                        <div className="results-count">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H9L11 8H20C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span>{filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}</span>
                        </div>
                    </div>
                </div>

                {/* Cars Grid */}
                {filteredCars.length === 0 ? (
                    <div className="no-results">
                        <p className="no-results-text">No cars found matching your criteria</p>
                        <p className="no-results-subtext">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="cars-grid">
                        {filteredCars.map(car => (
                            <CarCard
                                key={car.carID}
                                car={car}
                                onBook={(selectedCar) => navigate('/make-booking', {
                                    state: {
                                        selectedCar: {
                                            carID: selectedCar.carID,
                                            brand: selectedCar.brand,
                                            model: selectedCar.model,
                                            year: selectedCar.year,
                                            rentalPrice: selectedCar.rentalPrice,
                                            imageUrl: selectedCar.imageUrl
                                        }
                                    }
                                })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarView;