/*
Lisakhanya Zumana
230864821
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLocations } from "../../../services/location.service";
import "./LocationList.css";

const PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

function LocationCard({ location }) {
    return (
        <div className="location-card">
            <div className="location-card__header">
                <h3>{location.locationName}</h3>
                <p><b>Street Number:</b> {location.streetNumber}</p>
                <p><b>Street:</b> {location.streetName}</p>
                <p><b>City/Town:</b> {location.cityOrTown}</p>
                <p><b>Province:</b> {location.provinceOrState}</p>
                <p><b>Country:</b> {location.country}</p>
                <p><b>Postal Code:</b> {location.postalCode}</p>
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

    if (loading) return <div className="loading">Loading locations...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="location-list-container">
            <div className="location-controls">
                <input
                    type="text"
                    placeholder="Search by name, city, or street..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="location-search"
                />
                <select
                    value={selectedProvince}
                    onChange={e => setSelectedProvince(e.target.value)}
                    className="location-filter"
                >
                    <option value="all">All Provinces</option>
                    {PROVINCES.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                    ))}
                </select>
                <span className="results-count">
                    {filteredLocations.length} {filteredLocations.length === 1 ? "location" : "locations"} found
                </span>
            </div>
            <div className="location-grid">
                {filteredLocations.length === 0 ? (
                    <div className="no-results">No locations found.</div>
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
