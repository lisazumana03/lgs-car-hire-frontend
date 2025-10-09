import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllLocations } from "../../../services/locationService";
import "./LocationSelector.css";

const PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

function LocationSelector() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCar = location.state?.selectedCar;
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    // New: Separate state for pickup and dropoff, and keep them until reset
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropOffLocation, setDropOffLocation] = useState(null);

    useEffect(() => {
        getAllLocations()
            .then(res => {
                if (!Array.isArray(res.data)) {
                    setError("Backend did not return a list of locations. Check your backend controller return type.");
                    setLocations([]);
                } else {
                    setLocations(res.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load locations. " + (err?.response?.data?.message || err.message));
                setLoading(false);
            });
    }, []);

    // Filter by province and search term
    let filteredLocations = locations.filter(loc => {
        const matchesProvince = selectedProvince === "all" || (loc.provinceOrState || "") === selectedProvince;
        const matchesSearch = (loc.locationName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loc.cityOrTown || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesProvince && matchesSearch;
    });

    // Prevent selecting the same location for both pickup and dropoff
    const isSameLocation = pickupLocation && dropOffLocation && pickupLocation.locationID === dropOffLocation.locationID;

    const handleSelectPickup = (loc) => {
        setPickupLocation(loc);
        // If dropoff is the same, clear dropoff
        if (dropOffLocation && dropOffLocation.locationID === loc.locationID) {
            setDropOffLocation(null);
        }
    };

    const handleSelectDropOff = (loc) => {
        setDropOffLocation(loc);
        // If pickup is the same, clear pickup
        if (pickupLocation && pickupLocation.locationID === loc.locationID) {
            setPickupLocation(null);
        }
    };

    const handleReset = () => {
        setPickupLocation(null);
        setDropOffLocation(null);
        setSelectedProvince("all");
        setSearchTerm("");
    };

    const handleProceed = () => {
        if (pickupLocation && dropOffLocation && pickupLocation.locationID !== dropOffLocation.locationID) {
            navigate("/make-booking", {
                state: {
                    selectedCar,
                    selectedPickupLocation: pickupLocation,
                    selectedDropOffLocation: dropOffLocation
                }
            });
        }
    };

    return (
        <div className="location-selection-container">
            <div className="location-selection-wrapper">
                <div className="selection-header">
                    <h1>Choose Pick Up and Drop Off Locations</h1>
                    <p>Select two different locations for your booking</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Filters */}
                <div className="filters-container">
                    <div className="filters-grid">
                        <div className="search-box">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name or city..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}>
                                <option value="all">All Provinces</option>
                                {PROVINCES.map(prov => (
                                    <option key={prov} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="results-section">
                        <div className="results-count">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span>{filteredLocations.length} {filteredLocations.length === 1 ? "location" : "locations"}</span>
                        </div>
                    </div>
                </div>

                {/* Selected Locations */}
                <div className="selected-locations">
                    <div>
                        <b>Pick Up Location:</b>{" "}
                        {pickupLocation
                            ? `${pickupLocation.locationName} (${pickupLocation.cityOrTown})`
                            : <span style={{ color: "#aaa" }}>None selected</span>}
                    </div>
                    <div>
                        <b>Drop Off Location:</b>{" "}
                        {dropOffLocation
                            ? `${dropOffLocation.locationName} (${dropOffLocation.cityOrTown})`
                            : <span style={{ color: "#aaa" }}>None selected</span>}
                    </div>
                    {isSameLocation && (
                        <div className="error-text">
                            Pick up and drop off locations must be different.
                        </div>
                    )}
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
                            <div key={loc.locationID || loc.id || Math.random()} className="location-card">
                                <div className="location-details">
                                    <h3 className="location-title">{loc.locationName || "No Name"}</h3>
                                    <p className="location-meta">{loc.streetName || ""}, {loc.cityOrTown || ""}</p>
                                    <p className="location-meta">{loc.provinceOrState || ""}, {loc.country || ""}</p>
                                    <p className="location-meta">Postal Code: {loc.postalCode || ""}</p>
                                </div>
                                <div className="location-button-group">
                                    <button
                                        onClick={() => handleSelectPickup(loc)}
                                        className={`select-location-button ${pickupLocation && pickupLocation.locationID === loc.locationID ? 'selected' : ''}`}
                                        disabled={pickupLocation && pickupLocation.locationID === loc.locationID}
                                    >
                                        {pickupLocation && pickupLocation.locationID === loc.locationID ? "✓ Pickup" : "Select Pickup"}
                                    </button>
                                    <button
                                        onClick={() => handleSelectDropOff(loc)}
                                        className={`select-location-button ${dropOffLocation && dropOffLocation.locationID === loc.locationID ? 'selected' : ''}`}
                                        disabled={dropOffLocation && dropOffLocation.locationID === loc.locationID}
                                    >
                                        {dropOffLocation && dropOffLocation.locationID === loc.locationID ? "✓ Drop Off" : "Select Drop Off"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="back-section">
                    <button
                        onClick={handleProceed}
                        className="btn-proceed"
                        disabled={
                            !pickupLocation ||
                            !dropOffLocation ||
                            pickupLocation.locationID === dropOffLocation.locationID
                        }
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Proceed to Booking
                    </button>
                    <button
                        onClick={handleReset}
                        className="btn-reset"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Reset
                    </button>
                    <button
                        onClick={() => navigate('/booking-history')}
                        className="btn-back"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back to Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LocationSelector;
