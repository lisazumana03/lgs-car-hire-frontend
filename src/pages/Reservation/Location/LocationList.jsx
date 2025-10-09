/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLocations } from "../../../services/locationService";
import "./LocationList.css";

const PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

function LocationCard({ location }) {
    return (
        <div className="location-list-location-card">
            <div className="card-header">
                <h3 className="card-title">{location.locationName}</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
            </div>
            <div className="card-content">
                <div className="info-row">
                    <span className="info-label">Address</span>
                    <span className="info-value">{location.streetNumber} {location.streetName}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">City</span>
                    <span className="info-value">{location.cityOrTown}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Province</span>
                    <span className="info-value">{location.provinceOrState}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Country</span>
                    <span className="info-value">{location.country}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Postal Code</span>
                    <span className="info-value">{location.postalCode}</span>
                </div>
            </div>
        </div>
    );
}

function LocationList() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("all");

    useEffect(() => {
        setLoading(true);
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
                setError("Failed to fetch locations. " + (err?.response?.data?.message || err.message));
                setLoading(false);
            });
    }, []);

    const filteredLocations = locations.filter(loc => {
        const matchesProvince = selectedProvince === "all" || (loc.provinceOrState || "") === selectedProvince;
        const matchesSearch =
            (loc.locationName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loc.cityOrTown || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loc.streetName || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesProvince && matchesSearch;
    });

    if (loading) {
        return (
            <div className="location-list-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading locations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="location-list-container">
                <div className="error-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <h3>Error Loading Locations</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="location-list-container">
            <div className="locations-filters">
                <div className="search-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, city, or street..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <select
                        value={selectedProvince}
                        onChange={e => setSelectedProvince(e.target.value)}
                    >
                        <option value="all">All Provinces</option>
                        {PROVINCES.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                        ))}
                    </select>
                </div>
                <div className="results-count">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{filteredLocations.length} {filteredLocations.length === 1 ? "location" : "locations"}</span>
                </div>
            </div>

            <div className="location-list-locations-grid">
                {filteredLocations.length === 0 ? (
                    <div className="no-results">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 13V7M12 7L9.5 9.5M12 7L14.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3>No Locations Found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    filteredLocations.map(loc => (
                        <LocationCard key={loc.locationID || loc.id || Math.random()} location={loc} />
                    ))
                )}
            </div>
        </div>
    );
}

export default LocationList;
