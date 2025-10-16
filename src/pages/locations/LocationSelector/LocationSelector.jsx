import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllLocations } from "../../../services/location.service";
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
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropOffLocation, setDropOffLocation] = useState(null);

    useEffect(() => {
        getAllLocations()
            .then(data => {
                if (!Array.isArray(data)) {
                    setError("Backend did not return a list of locations. Check your backend controller return type.");
                    setLocations([]);
                } else {
                    setLocations(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load locations. " + err.message);
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
                        <div style={{ color: "red", marginTop: 8 }}>
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
                                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                    <button
                                        onClick={() => handleSelectPickup(loc)}
                                        className="select-location-button"
                                        disabled={pickupLocation && pickupLocation.locationID === loc.locationID}
                                    >
                                        {pickupLocation && pickupLocation.locationID === loc.locationID ? "Selected as Pickup" : "Select as Pickup"}
                                    </button>
                                    <button
                                        onClick={() => handleSelectDropOff(loc)}
                                        className="select-location-button"
                                        disabled={dropOffLocation && dropOffLocation.locationID === loc.locationID}
                                    >
                                        {dropOffLocation && dropOffLocation.locationID === loc.locationID ? "Selected as Drop Off" : "Select as Drop Off"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="back-section" style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button
                        onClick={handleProceed}
                        className="select-location-button"
                        disabled={
                            !pickupLocation ||
                            !dropOffLocation ||
                            pickupLocation.locationID === dropOffLocation.locationID
                        }
                    >
                        Proceed to Booking
                    </button>
                    <button
                        onClick={handleReset}
                        className="select-location-button"
                        style={{ backgroundColor: "#ff9800" }}
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => navigate('/booking-history')}
                        className="select-location-button"
                        style={{ backgroundColor: "#888" }}
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LocationSelector;
