import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableCars } from "../../../services/car.service";
import { getActivePricingRuleForCarType } from "../../../services/pricingRule.service";
import CarCard from "../../../components/vehicles/CarCard/CarCard";
import { getCategoryLabel } from '../../../models/carType.model';
import './CarSelection.css';

function CarSelection() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAvailableCars();
            const carsData = response.data || [];

            // Fetch pricing for each car based on carTypeID
            const carsWithPricing = await Promise.all(
                carsData.map(async (car) => {
                    if (car.carTypeID) {
                        try {
                            const pricingResponse = await getActivePricingRuleForCarType(car.carTypeID);
                            const pricing = pricingResponse.data;
                            return {
                                ...car,
                                dailyRate: pricing?.baseDailyRate || null,
                                weeklyRate: pricing?.weeklyRate || null,
                                monthlyRate: pricing?.monthlyRate || null
                            };
                        } catch (err) {
                            console.error(`Error fetching pricing for car type ${car.carTypeID}:`, err);
                            return car;
                        }
                    }
                    return car;
                })
            );

            setCars(carsWithPricing);
        } catch (err) {
            console.error('Error fetching cars:', err);
            setError('Failed to load cars. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookCar = (carID) => {
        const selectedCar = cars.find(car => car.carID === carID);
        if (selectedCar) {
            navigate('/make-booking', {
                state: { selectedCar }
            });
        } else {
            console.error('Car not found:', carID);
        }
    };

    // Get unique brands and categories for filters
    const brands = [...new Set(cars.map(car => car.brand))];
    const categories = [...new Set(cars.map(car => car.carTypeCategory).filter(Boolean))];

    // Filter cars
    let filteredCars = cars.filter(car => {
        const matchesSearch =
            car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
        const matchesCategory = selectedCategory === 'all' || car.carTypeCategory === selectedCategory;

        return matchesSearch && matchesBrand && matchesCategory;
    });

    if (loading) {
        return (
            <div className="modern-selection-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading available vehicles...</p>
            </div>
        );
    }

    return (
        <div className="modern-selection-container">
            {/* Hero Header */}
            <div className="selection-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Choose Your Perfect Vehicle</h1>
                    <p className="hero-subtitle">Select from our premium fleet of available vehicles</p>
                </div>
            </div>

            <div className="selection-content">
                {error && (
                    <div className="modern-error-message">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                )}

                {/* Modern Filters */}
                <div className="modern-filters-section">
                    <div className="search-wrapper">
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="modern-search-input"
                        />
                    </div>

                    <div className="modern-filters-grid">
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="modern-select"
                        >
                            <option value="all">All Brands</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="modern-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{getCategoryLabel(category)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="status-bar">
                        <span className="results-badge">
                            {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} available
                        </span>
                    </div>
                </div>

                {/* Cars Grid */}
                {filteredCars.length === 0 ? (
                    <div className="modern-no-results">
                        <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="no-results-title">No vehicles available</p>
                        <p className="no-results-text">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="modern-cars-grid">
                        {filteredCars.map(car => (
                            <CarCard
                                key={car.carID}
                                car={car}
                                onBook={handleBookCar}
                                showDetails={true}
                            />
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="back-section">
                    <button
                        onClick={() => navigate(-1)}
                        className="modern-back-button"
                    >
                        <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarSelection;
