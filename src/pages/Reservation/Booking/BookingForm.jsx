/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "../../../services/bookingService";
import { getAvailableCars } from "../../../services/carService";
import "./BookingForm.css";

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

    const [form, setForm] = useState({
        cars: [selectedCar?.carID || ""],
        bookingDateAndTime: getCurrentDateTime(),
        startDate: "",
        endDate: "",
        pickupLocation: selectedPickupLocation ? selectedPickupLocation.locationID : "",
        dropOffLocation: selectedDropOffLocation ? selectedDropOffLocation.locationID : "",
        bookingStatus: "PENDING"
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [carsLoading, setCarsLoading] = useState(true);


    // Fetch available cars on component mount
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setCarsLoading(true);
                const response = await getAvailableCars();
                setCars(response.data || []);
            } catch (error) {
                console.error("Error fetching cars:", error);
                setMessage("Failed to load available cars. Please try again.");
                setMessageType("error");
            } finally {
                setCarsLoading(false);
            }
        };

        fetchCars();
    }, []);

    // Update form state if locations change (e.g., after navigation)
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            pickupLocation: selectedPickupLocation ? selectedPickupLocation.locationID : "",
            dropOffLocation: selectedDropOffLocation ? selectedDropOffLocation.locationID : ""
        }));
    }, [selectedPickupLocation, selectedDropOffLocation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cars") {
            setForm((prev) => ({ ...prev, cars: [value] }));
        } else if (name === "bookingStatus") {
            setForm((prev) => ({ ...prev, bookingStatus: value.toUpperCase() }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const isStartDateValid = !form.startDate || form.startDate >= form.bookingDateAndTime;
    const isEndDateValid = !form.endDate || form.endDate > form.startDate;

    const handleSubmit = async (error) => {
        error.preventDefault();
        if (!isStartDateValid) {
            setMessage("Start date/time must be after or equal to booking date/time.");
            setMessageType("error");
            return;
        }
        if (!isEndDateValid) {
            setMessage("End date/time must be after start date/time.");
            setMessageType("error");
            return;
        }

        // Prepare payload with correct structure
        const payload = {
            ...form,
            cars: selectedCar ? [{ carID: selectedCar.carID }] : [],
            pickupLocation: selectedPickupLocation ? { locationID: selectedPickupLocation.locationID } : null,
            dropOffLocation: selectedDropOffLocation ? { locationID: selectedDropOffLocation.locationID } : null,
        };

        try {
            const response = await create(payload);
            console.log("Booking created:", response.data);
            setMessage("Booking created successfully!");
            setMessageType("success");
            setForm({
                cars: [""],
                bookingDateAndTime: "",
                startDate: "",
                endDate: "",
                pickupLocation: [""],
                dropOffLocation: [""],
                bookingStatus: "PENDING"
            });

            const calculateTotalAmount = () => {
                if (!selectedCar?.rentalPrice || !form.startDate || !form.endDate) {
                    return selectedCar?.rentalPrice || 500;
                }

                const startDate = new Date(form.startDate);
                const endDate = new Date(form.endDate);
                const timeDiff = endDate.getTime() - startDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                return (selectedCar.rentalPrice * Math.max(1, daysDiff));
            };

            setTimeout(() => {
                navigate("/payment", {
                    state: {
                        booking: {
                            bookingID: response.data?.bookingID,
                            bookingDateAndTime: form.bookingDateAndTime,
                            startDate: form.startDate,
                            endDate: form.endDate,
                            bookingStatus: "pending",
                            car: selectedCar,
                            totalAmount: calculateTotalAmount()
                        }
                    }
                });
            }, 2000);
        } catch (err) {
            console.error("Error creating booking:", err);
            let errorMessage = "Error creating booking.";

            if (err.response?.status === 404) {
                errorMessage = "Booking endpoint not found. Please check if the backend is running correctly.";
            } else if (err.response?.status === 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setMessage(errorMessage);
            setMessageType("error");
        }
    };

    return (
        <div className="booking-form-container">
            <div className="booking-form-card">
                <div className="booking-form-header">
                    <h2>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Make a Booking
                    </h2>
                    <p>Complete your reservation details</p>
                </div>

                <div className="booking-form-body">
                    {message && (
                        <div className={`booking-message ${messageType}`}>
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
                        <div className="booking-form-grid">
                            {/* Selected Car */}
                            <div className="booking-form-group">
                                <label>Selected Car <span className="required">*</span></label>
                                {selectedCar ? (
                                    <div className="selected-item-card">
                                        <div className="selected-item-info">
                                            <h3>{selectedCar.brand} {selectedCar.model}</h3>
                                            <p>{selectedCar.year} • R{selectedCar.rentalPrice}/day</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/select-car')}
                                            className="btn btn-change"
                                        >
                                            Change Car
                                        </button>
                                    </div>
                                ) : (
                                    <div className="no-selection">
                                        <p>No car selected</p>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/select-car')}
                                            className="btn btn-warning"
                                        >
                                            Choose a Car
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Booking Date & Time */}
                            <div className="booking-form-group">
                                <label>Booking Date & Time <span className="required">*</span></label>
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
                            <div className="booking-form-group">
                                <label>Start Date & Time <span className="required">*</span></label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    required
                                    min={form.bookingDateAndTime}
                                />
                                {!isStartDateValid && (
                                    <div className="validation-error">
                                        Start date/time must be after or equal to booking date/time.
                                    </div>
                                )}
                            </div>

                            {/* End Date & Time */}
                            <div className="booking-form-group">
                                <label>End Date & Time <span className="required">*</span></label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    required
                                    min={form.startDate || form.bookingDateAndTime}
                                />
                                {!isEndDateValid && (
                                    <div className="validation-error">
                                        End date/time must be after start date/time.
                                    </div>
                                )}
                            </div>

                            {/* Pick-up Location */}
                            <div className="booking-form-group">
                                <label>Pick-up Location <span className="required">*</span></label>
                                {selectedPickupLocation ? (
                                    <div className="selected-item-card">
                                        <div className="selected-item-info">
                                            <h3>{selectedPickupLocation.locationName}</h3>
                                            <p>{selectedPickupLocation.streetNumber} {selectedPickupLocation.streetName}, {selectedPickupLocation.cityOrTown}</p>
                                            <p>{selectedPickupLocation.provinceOrState}, {selectedPickupLocation.country}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/choose-location', {
                                                state: {
                                                    selectedCar,
                                                    selectedPickupLocation,
                                                    selectedDropOffLocation
                                                }
                                            })}
                                            className="btn btn-change"
                                        >
                                            Change Location
                                        </button>
                                    </div>
                                ) : (
                                    <div className="no-selection">
                                        <p>No pickup location selected</p>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/choose-location', {
                                                state: {
                                                    selectedCar,
                                                    selectedPickupLocation,
                                                    selectedDropOffLocation
                                                }
                                            })}
                                            className="btn btn-warning"
                                        >
                                            Choose Location
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Drop-Off Location */}
                            <div className="booking-form-group">
                                <label>Drop-Off Location <span className="required">*</span></label>
                                {selectedDropOffLocation ? (
                                    <div className="selected-item-card">
                                        <div className="selected-item-info">
                                            <h3>{selectedDropOffLocation.locationName}</h3>
                                            <p>{selectedDropOffLocation.streetNumber} {selectedDropOffLocation.streetName}, {selectedDropOffLocation.cityOrTown}</p>
                                            <p>{selectedDropOffLocation.provinceOrState}, {selectedDropOffLocation.country}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/choose-location', {
                                                state: {
                                                    selectedCar,
                                                    selectedPickupLocation,
                                                    selectedDropOffLocation
                                                }
                                            })}
                                            className="btn btn-change"
                                        >
                                            Change Location
                                        </button>
                                    </div>
                                ) : (
                                    <div className="no-selection">
                                        <p>No drop-off location selected</p>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/choose-location', {
                                                state: {
                                                    selectedCar,
                                                    selectedPickupLocation,
                                                    selectedDropOffLocation
                                                }
                                            })}
                                            className="btn btn-warning"
                                        >
                                            Choose Location
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Booking Status */}
                            <div className="booking-form-group">
                                <label>Booking Status <span className="required">*</span></label>
                                <select
                                    name="bookingStatus"
                                    value={form.bookingStatus}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="booking-form-actions">
                            <button type="submit" className="btn btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Submit Booking
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setForm({
                                    cars: [""],
                                    bookingDateAndTime: getCurrentDateTime(),
                                    startDate: "",
                                    endDate: "",
                                    pickupLocation: [""],
                                    dropOffLocation: [""],
                                    bookingStatus: "PENDING"
                                })}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Reset
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => navigate("/bookings")}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Back to Bookings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
