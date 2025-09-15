import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLocations } from "../../../services/locationService";
import "./LocationSelector.css";

const PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

function LocationSelector() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getAllLocations();
            setLocations(response.data || []);
        } catch (err) {
            setError("Failed to load locations. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Filter by province and search term
    let filteredLocations = locations.filter(loc => {
        const matchesProvince = selectedProvince === "all" || loc.provinceOrState === selectedProvince;
        const matchesSearch = loc.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.cityOrTown.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesProvince && matchesSearch;
    });

    return (
        <div className="location-selection-container">
            <div className="location-selection-wrapper">
                <div className="selection-header">
                    <h1>Choose a Pick Up Location</h1>
                    <p>Select a province to see available locations</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Filters */}
                <div className="filters-container">
                    <div className="filters-grid">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by name or city..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="filter-group">
                            <select
                                value={selectedProvince}
                                onChange={e => setSelectedProvince(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Provinces</option>
                                {PROVINCES.map(prov => (
                                    <option key={prov} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="results-section">
                        <span className="results-count">
                            {filteredLocations.length} {filteredLocations.length === 1 ? "location" : "locations"} found
                        </span>
                    </div>
                </div>

                {/* Locations Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading locations...</p>
                    </div>
                ) : filteredLocations.length === 0 ? (
                    <div className="no-results">
                        <p>No locations found for the selected province.</p>
                    </div>
                ) : (
                    <div className="locations-grid">
                        {filteredLocations.map(loc => (
                            <div key={loc._id} className="location-card">
                                <div className="location-details">
                                    <h3 className="location-title">{loc.locationName}</h3>
                                    <p className="location-meta">{loc.streetName}, {loc.cityOrTown}</p>
                                    <p className="location-meta">{loc.provinceOrState}, {loc.country}</p>
                                    <p className="location-meta">Postal Code: {loc.postalCode}</p>
                                </div>
                                <button
                                    onClick={() => navigate("/make-booking", { state: { selectedLocation: loc } })}
                                    className="select-location-button"
                                >
                                    Select Location
                                </button>
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

export default LocationSelector;
