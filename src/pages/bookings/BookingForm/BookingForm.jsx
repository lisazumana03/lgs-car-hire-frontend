/*
Lisakhanya Zumana
230864821
Updated: 2025-10-16 - Styled to match multi-step registration template
*/
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create, calculateRentalDays, calculateBookingTotals } from "../../../services/booking.service";
import { getAvailableCars } from "../../../services/car.service";
import { getAllInsurance } from "../../../services/insurance.service";
import { BookingStatus, CoverageTypeDisplay, CoverageTypeDescription } from "../../../constants/enums";
import './BookingFormStyled.css';

const getCurrentDateTime = () => {
    const now = new Date();
    const pad = n => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export default function BookingForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCar = location.state?.selectedCar;
    const selectedPickupLocation = location.state?.selectedPickupLocation;
    const selectedDropOffLocation = location.state?.selectedDropOffLocation;

    const [userId, setUserId] = useState(null);
    const [formActive, setFormActive] = useState(false);
    const [form, setForm] = useState({
        bookingDateAndTime: getCurrentDateTime(),
        startDate: "",
        endDate: "",
        insurance: null,
        bookingStatus: BookingStatus.PENDING
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [insurances, setInsurances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [insurancesLoading, setInsurancesLoading] = useState(true);
    const [calculatedCosts, setCalculatedCosts] = useState(null);
    const [selectedInsurance, setSelectedInsurance] = useState(null);

    // Get user ID when component mounts
    useEffect(() => {
        const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const currentUserId = user.id || user.userID || user.userId || user.ID;
                setUserId(currentUserId);
            } catch (error) {
                console.error('Error parsing user from storage:', error);
                setMessage('Please login to make a booking');
                setMessageType('error');
            }
        } else {
            setMessage('Please login to make a booking');
            setMessageType('error');
        }
    }, []);

    // Fetch insurances
    useEffect(() => {
        const fetchInsurances = async () => {
            try {
                setInsurancesLoading(true);
                const insurancesResponse = await getAllInsurance();
                setInsurances(insurancesResponse || []);
            } catch (error) {
                console.error("Error fetching insurances:", error);
            } finally {
                setInsurancesLoading(false);
            }
        };
        fetchInsurances();
    }, []);

    // Calculate costs when dates or insurance change
    useEffect(() => {
        if (selectedCar && form.startDate && form.endDate) {
            const rentalDays = calculateRentalDays(form.startDate, form.endDate);
            const insuranceCost = selectedInsurance ? selectedInsurance.insuranceCost * rentalDays : 0;
            const costs = calculateBookingTotals(selectedCar.rentalPrice, rentalDays, insuranceCost);
            setCalculatedCosts(costs);
        } else {
            setCalculatedCosts(null);
        }
    }, [selectedCar, form.startDate, form.endDate, selectedInsurance]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleInsuranceSelect = (insuranceId) => {
        if (insuranceId === "none" || !insuranceId) {
            setSelectedInsurance(null);
            setForm((prev) => ({ ...prev, insurance: null }));
        } else {
            const insurance = insurances.find(ins => ins.insuranceID === parseInt(insuranceId));
            setSelectedInsurance(insurance);
            setForm((prev) => ({ ...prev, insurance: { insuranceID: insurance.insuranceID } }));
        }
    };

    const isFirstStepValid = () => {
        return form.startDate && form.endDate && selectedCar && selectedPickupLocation && selectedDropOffLocation;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (isFirstStepValid()) {
            setFormActive(true);
        } else {
            setMessage("Please complete all required fields before proceeding.");
            setMessageType("error");
        }
    };

    const handleBack = () => {
        setFormActive(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const payload = {
            user: { userId: userId },
            car: { carID: selectedCar.carID },
            bookingDateAndTime: form.bookingDateAndTime,
            startDate: form.startDate,
            endDate: form.endDate,
            pickupLocation: { locationID: selectedPickupLocation.locationID },
            dropOffLocation: { locationID: selectedDropOffLocation.locationID },
            insurance: form.insurance,
            bookingStatus: form.bookingStatus,
            ...calculatedCosts
        };

        try {
            const response = await create(payload);
            setMessage("Booking created successfully!");
            setMessageType("success");

            setTimeout(() => {
                navigate("/payment", {
                    state: {
                        booking: {
                            ...response,
                            car: selectedCar,
                            pickupLocation: selectedPickupLocation,
                            dropOffLocation: selectedDropOffLocation,
                            insurance: selectedInsurance
                        }
                    }
                });
            }, 2000);
        } catch (err) {
            console.error("Error creating booking:", err);
            setMessage(err.message || "Error creating booking.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm({
            bookingDateAndTime: getCurrentDateTime(),
            startDate: "",
            endDate: "",
            insurance: null,
            bookingStatus: BookingStatus.PENDING
        });
        setSelectedInsurance(null);
        setMessage("");
        setFormActive(false);
    };

    return (
        <div className="booking-form-wrapper">
            <div className="booking-container">
                <header>Make a Booking</header>

                <form className={formActive ? 'secActive' : ''} onSubmit={formActive ? handleSubmit : handleNext}>
                    {/* STEP 1: Booking Details */}
                    <div className="form-step first">
                        <div className="details">
                            <div className="fields">
                                {/* Selected Car */}
                                <div className="input-field full-width">
                                    <label>Selected Car *</label>
                                    {selectedCar ? (
                                        <div className="selected-item-display">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h3>{selectedCar.brand} {selectedCar.model}</h3>
                                                    <p style={{ margin: '5px 0', color: '#666' }}>{selectedCar.year}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '20px', fontWeight: '600', color: '#4070f4', margin: '0' }}>
                                                        R{selectedCar.rentalPrice}
                                                    </p>
                                                    <p style={{ fontSize: '13px', color: '#888', margin: '0' }}>per day</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => navigate('/select-car')} className="button-back">
                                            Choose a Car
                                        </button>
                                    )}
                                </div>

                                {/* Booking Date & Time */}
                                <div className="input-field">
                                    <label>Booking Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="bookingDateAndTime"
                                        value={form.bookingDateAndTime}
                                        onChange={handleChange}
                                        readOnly
                                        required
                                    />
                                </div>

                                {/* Start Date & Time */}
                                <div className="input-field">
                                    <label>Start Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        min={form.bookingDateAndTime}
                                        required
                                    />
                                </div>

                                {/* End Date & Time */}
                                <div className="input-field">
                                    <label>End Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={handleChange}
                                        min={form.startDate || form.bookingDateAndTime}
                                        required
                                    />
                                </div>

                                {/* Pick-up Location */}
                                <div className="input-field full-width">
                                    <label>Pick-up Location *</label>
                                    {selectedPickupLocation ? (
                                        <div className="selected-item-display">
                                            <h3>{selectedPickupLocation.locationName}</h3>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => navigate('/choose-location', { state: { ...location.state, locationType: 'pickup' } })} className="button-back">
                                            Choose Pick-up Location
                                        </button>
                                    )}
                                </div>

                                {/* Drop-off Location */}
                                <div className="input-field full-width">
                                    <label>Drop-off Location *</label>
                                    {selectedDropOffLocation ? (
                                        <div className="selected-item-display">
                                            <h3>{selectedDropOffLocation.locationName}</h3>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => navigate('/choose-location', { state: { ...location.state, locationType: 'dropoff' } })} className="button-back">
                                            Choose Drop-off Location
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="nextBtn" disabled={!userId || !isFirstStepValid()}>
                                <span className="btnText">Next</span>
                                <i className="uil uil-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* STEP 2: Insurance & Payment */}
                    <div className="form-step second">
                        <div className="details">
                            <span className="title">Insurance Coverage</span>

                            <div className="insurance-options">
                                {/* No Insurance Option */}
                                <div
                                    className={`insurance-option ${!selectedInsurance ? 'selected' : ''}`}
                                    onClick={() => handleInsuranceSelect("none")}
                                >
                                    <div className="insurance-option-header">
                                        <h4>No Insurance</h4>
                                        <span className="insurance-cost">R0/day</span>
                                    </div>
                                    <p className="insurance-description">No additional coverage</p>
                                </div>

                                {/* Available Insurance Options */}
                                {insurancesLoading ? (
                                    <p>Loading insurance options...</p>
                                ) : (
                                    insurances.filter(ins => ins.isActive).map((insurance) => (
                                        <div
                                            key={insurance.insuranceID}
                                            className={`insurance-option ${selectedInsurance?.insuranceID === insurance.insuranceID ? 'selected' : ''}`}
                                            onClick={() => handleInsuranceSelect(insurance.insuranceID.toString())}
                                        >
                                            <div className="insurance-option-header">
                                                <h4>{CoverageTypeDisplay[insurance.coverageType] || insurance.coverageType}</h4>
                                                <span className="insurance-cost">R{insurance.insuranceCost}/day</span>
                                            </div>
                                            <p className="insurance-description">
                                                {CoverageTypeDescription[insurance.coverageType]}
                                            </p>
                                            <p className="insurance-details">
                                                Provider: {insurance.insuranceProvider} • Deductible: R{insurance.deductible.toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cost Summary */}
                            {calculatedCosts && (
                                <div className="cost-summary">
                                    <h3>Cost Summary</h3>
                                    <div className="cost-row">
                                        <span>Rental ({calculatedCosts.rentalDays} days @ R{selectedCar.rentalPrice}/day)</span>
                                        <span>R{(selectedCar.rentalPrice * calculatedCosts.rentalDays).toFixed(2)}</span>
                                    </div>
                                    {selectedInsurance && (
                                        <div className="cost-row">
                                            <span>Insurance ({calculatedCosts.rentalDays} days @ R{selectedInsurance.insuranceCost}/day)</span>
                                            <span>R{(selectedInsurance.insuranceCost * calculatedCosts.rentalDays).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="cost-row">
                                        <span>Subtotal</span>
                                        <span>R{calculatedCosts.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="cost-row">
                                        <span>Tax (15% VAT)</span>
                                        <span>R{calculatedCosts.taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="cost-row total">
                                        <span>Total</span>
                                        <span>R{calculatedCosts.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="buttons">
                                <div className="backBtn" onClick={handleBack}>
                                    <i className="uil uil-arrow-left"></i>
                                    <span className="btnText">Back</span>
                                </div>

                                <button type="submit" className="button-submit" disabled={loading}>
                                    {loading && <span className="loading-spinner"></span>}
                                    <span className="btnText">{loading ? 'Creating...' : 'Submit'}</span>
                                    <i className="uil uil-check"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Messages */}
                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}
            </div>

            {/* Include Iconscout Icons */}
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css" />
        </div>
    );
}
