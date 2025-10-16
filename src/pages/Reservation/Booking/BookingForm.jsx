/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "../../../services/bookingService";
import { getAvailableCars } from "../../../services/carService";

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

    // Get user ID when component mounts
    useEffect(() => {
        // Try to get user from session/localStorage
        const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
        
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const currentUserId = user.id || user.userID || user.userId || user.ID;
                
                console.log('Current user:', user);
                console.log('User ID extracted:', currentUserId);
                
                setUserId(currentUserId);
            } catch (error) {
                console.error('Error parsing user from storage:', error);
                setMessage('Please login to make a booking');
                setMessageType('error');
            }
        } else {
            console.warn('No user found in storage');
            setMessage('Please login to make a booking');
            setMessageType('error');
        }
    }, []);


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
        
        // Check if user is logged in
        if (!userId) {
            setMessage("Please login to make a booking");
            setMessageType("error");
            return;
        }
        
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

        // Prepare payload with correct structure including user
        // Handle both database locations (with locationID) and map-based locations (without locationID)
        const payload = {
            user: {
                userId: userId  // Include the user with userId
            },
            bookingDateAndTime: form.bookingDateAndTime,
            startDate: form.startDate,
            endDate: form.endDate,
            bookingStatus: form.bookingStatus,
            cars: selectedCar ? [{ carID: selectedCar.carID }] : [],
            // If location has locationID, send just the ID; otherwise send the full location object
            pickupLocation: selectedPickupLocation 
                ? (selectedPickupLocation.locationID 
                    ? { locationID: selectedPickupLocation.locationID }
                    : selectedPickupLocation)
                : null,
            dropOffLocation: selectedDropOffLocation 
                ? (selectedDropOffLocation.locationID 
                    ? { locationID: selectedDropOffLocation.locationID }
                    : selectedDropOffLocation)
                : null,
        };
        
        console.log('Submitting booking with payload:', payload);

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
        }
    };

    return (
        <div className="form-group">
            <div className="w-full max-w-lg bg-black/90 rounded-xl shadow-lg p-8 mt-8">
                <h2 style={{}}>Make a Booking</h2>
                
                {/* User Status Indicator */}
                {userId ? (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg">
                        <p className="text-green-400 text-sm">
                            ✓ Logged in (User ID: {userId})
                        </p>
                    </div>
                ) : (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
                        <p className="text-red-400 text-sm">
                            ⚠ Please login to make a booking
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="mt-2 text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Selected Car *</label>
                        {selectedCar ? (
                            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {selectedCar.brand} {selectedCar.model}
                                        </h3>
                                        <p className="text-gray-300">
                                            {selectedCar.year} • R{selectedCar.rentalPrice}/day
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/select-car')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Choose Different Car
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-gray-300">No car selected</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/select-car')}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                >
                                    Choose a Car
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Booking Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="bookingDateAndTime"
                            value={form.bookingDateAndTime}
                            onChange={handleChange}
                            readOnly
                            required
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Start Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                            min={form.bookingDateAndTime}
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                        />
                        {!isStartDateValid && (
                            <div className="text-red-400 text-sm mt-1">Start date/time must be after or equal to booking date/time.</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">End Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            required
                            min={form.startDate || form.bookingDateAndTime}
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                        />
                        {!isEndDateValid && (
                            <div className="text-red-400 text-sm mt-1">End date/time must be after start date/time.</div>
                        )}
                    </div>

                    {/* Show selected pickup location */}
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Pick-up Location *</label>
                        {selectedPickupLocation ? (
                            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-2">
                                <h3 className="text-lg font-semibold text-white">{selectedPickupLocation.locationName}</h3>
                                <p className="text-gray-300">{selectedPickupLocation.streetName}, {selectedPickupLocation.cityOrTown}</p>
                                <p className="text-gray-300">{selectedPickupLocation.provinceOrState}, {selectedPickupLocation.country}</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/maps-location-select', {
                                        state: {
                                            selectedCar,
                                            selectedPickupLocation,
                                            selectedDropOffLocation
                                        }
                                    })}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-2"
                                >
                                    Choose Different Location
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate('/maps-location-select', {
                                    state: {
                                        selectedCar,
                                        selectedPickupLocation,
                                        selectedDropOffLocation
                                    }
                                })}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Choose a Location
                            </button>
                        )}
                    </div>
                    {/* Show selected drop-off location */}
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Drop-Off Location *</label>
                        {selectedDropOffLocation ? (
                            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-2">
                                <h3 className="text-lg font-semibold text-white">{selectedDropOffLocation.locationName}</h3>
                                <p className="text-gray-300">{selectedDropOffLocation.streetName}, {selectedDropOffLocation.cityOrTown}</p>
                                <p className="text-gray-300">{selectedDropOffLocation.provinceOrState}, {selectedDropOffLocation.country}</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/maps-location-select', {
                                        state: {
                                            selectedCar,
                                            selectedPickupLocation,
                                            selectedDropOffLocation
                                        }
                                    })}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-2"
                                >
                                    Choose Different Location
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate('/maps-location-select', {
                                    state: {
                                        selectedCar,
                                        selectedPickupLocation,
                                        selectedDropOffLocation
                                    }
                                })}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Choose a Location
                            </button>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Booking Status *</label>
                        <select name="bookingStatus" value={form.bookingStatus} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none">
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div style={{display: "flex", marginTop: "20px", gap: "10px"}}>
                        <button type="submit"
                                disabled={!userId}
                                style={{
                                    backgroundColor: userId ? "#00ca09" : "#666",
                                    cursor: userId ? "pointer" : "not-allowed",
                                    opacity: userId ? 1 : 0.6
                                }}
                                className="submit-btn"
                                title={!userId ? "Please login to submit booking" : "Submit booking"}>
                            Submit
                        </button>
                        <button type="reset"
                                style={{backgroundColor: "#003ffa"}}
                                className="submit-btn" onClick={() => setForm({
                            cars: [""],
                            bookingDateAndTime: "",
                            startDate: "",
                            endDate: "",
                            pickupLocation: [""],
                            dropOffLocation: [""],
                            bookingStatus: "PENDING" // <-- Use uppercase
                        })}>Reset</button>
                        <button type="button"
                                style={{backgroundColor: "#ff0000"}}
                                className="submit-btn"
                                onClick={() => navigate("/bookings")}>Back</button>
                    </div>

                    {message && (
                        <p className={`mb-4 px-4 py-2 rounded border ${message.includes("successfully")
                            ? "bg-[#1e4d2b] text-green-400 border-green-500"
                            : "bg-[#4c1d1d] text-red-400 border-red-500"}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}