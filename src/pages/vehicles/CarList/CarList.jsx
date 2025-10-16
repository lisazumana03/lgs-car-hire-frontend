import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars, getAvailableCars } from "../../../services/car.service";
import { getActivePricingRuleForCarType } from "../../../services/pricingRule.service";
import CarCard from "../../../components/vehicles/CarCard/CarCard";
import { getCategoryLabel } from "../../../models/carType.model";
import "./CarList.css";

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
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError("Unable to load cars. Please try again later.");
            setLoading(false);
            setCars([]);
        }
    };

    const brands = [...new Set(cars.map(car => car.brand))];
    const types = [...new Set(cars.map(car => car.carTypeCategory).filter(Boolean))];

    let filteredCars = cars.filter(car => {
        const matchesSearch =
            car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;
        const matchesType = selectedType === "all" || car.carTypeCategory === selectedType;

        return matchesSearch && matchesBrand && matchesType;
    });

    if (loading) {
        return (
            <div className="modern-loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading cars...</p>
            </div>
        );
    }

    return (
        <div className="modern-car-list-container">
            <div className="car-list-content">
                {error && (
                    <div className="modern-error-message">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                )}

                {/* Modern Filter Section */}
                <div className="modern-filters-section">
                    {/* Search Bar */}
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

                    {/* Filters Grid */}
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
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="modern-select"
                        >
                            <option value="all">All Categories</option>
                            {types.map(type => (
                                <option key={type} value={type}>{getCategoryLabel(type)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Bar */}
                    <div className="status-bar">
                        <label className="modern-checkbox-label">
                            <input
                                type="checkbox"
                                checked={showOnlyAvailable}
                                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                className="modern-checkbox"
                            />
                            <span className="checkbox-text">Available only</span>
                        </label>
                        <span className="results-badge">
                            {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
                        </span>
                    </div>
                </div>

                {/* Cars Grid */}
                {filteredCars.length === 0 ? (
                    <div className="modern-no-results">
                        <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="no-results-title">No vehicles found</p>
                        <p className="no-results-text">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="modern-cars-grid">
                        {filteredCars.map(car => (
                            <CarCard
                                key={car.carID}
                                car={car}
                                onBook={(carId) => navigate(`/make-booking?carId=${carId}`)}
                                showDetails={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarView;