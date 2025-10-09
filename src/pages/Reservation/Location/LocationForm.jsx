/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../../services/locationService";
import "./LocationForm.css";

const PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

function LocationForm(){
    const navigate  = useNavigate();
    const [form, setForm] = useState({
        locationName: "",
        streetNumber: "",
        streetName: "",
        cityOrTown: "",
        provinceOrState: "",
        country: "South Africa",
        postalCode: "",
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure streetNumber is a number
        const payload = { ...form, streetNumber: Number(form.streetNumber) };
        try {
            await create(payload);
            setMessage("Location created successfully!");
            setMessageType("success");
            setForm({
                locationName: "",
                streetNumber: "",
                streetName: "",
                cityOrTown: "",
                provinceOrState: "",
                country: "South Africa",
                postalCode: "",
            });
            setTimeout(() => {
                setMessage("");
            }, 5000);
        } catch (err) {
            setMessage("Error creating location. " + (err?.response?.data?.message || err.message));
            setMessageType("error");
        }
    };

    const handleReset = () => {
        setForm({
            locationName: "",
            streetNumber: "",
            streetName: "",
            cityOrTown: "",
            provinceOrState: "",
            country: "South Africa",
            postalCode: "",
        });
        setMessage("");
    };

    return(
        <div className="location-form-container">
            <div className="form-card">
                <div className="form-card-header">
                    <h1>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Add New Location
                    </h1>
                    <p>Register a new pickup and drop-off location</p>
                </div>

                <div className="form-card-body">
                    {message && (
                        <div className={`form-message ${messageType}`}>
                            {messageType === "success" ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            )}
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Location Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="locationName"
                                    value={form.locationName}
                                    onChange={handleChange}
                                    placeholder="e.g., Cape Town International Airport"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Street Number <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        name="streetNumber"
                                        value={form.streetNumber}
                                        onChange={handleChange}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Street Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="streetName"
                                        value={form.streetName}
                                        onChange={handleChange}
                                        placeholder="Main Street"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City/Town <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="cityOrTown"
                                        value={form.cityOrTown}
                                        onChange={handleChange}
                                        placeholder="Cape Town"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Province <span className="required">*</span></label>
                                    <select
                                        name="provinceOrState"
                                        value={form.provinceOrState}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Province</option>
                                        {PROVINCES.map(prov => (
                                            <option key={prov} value={prov}>{prov}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        placeholder="South Africa"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        placeholder="8001"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Create Location
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleReset}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Reset Form
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/locations")}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Back to Locations
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LocationForm;