/**
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { create } from "../../../services/bookingService";
import { getAvailableCars } from "../../../services/carService";
import NotificationService from "../../../services/notificationService";
import LocationPicker from "../Location/LocationPicker";

function BookingForm({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCar = location.state?.selectedCar;
    
    const [form, setForm] = useState({
        userId: user?.id || 1, // Default to user ID 1 for testing
        carIds: selectedCar?.carID ? [selectedCar.carID] : [],
        bookingDateAndTime: "",
        startDate: "",
        endDate: "",
        pickupLocation: "",
        dropOffLocation: "",
        bookingStatus: "PENDING"
    });
    
    // Check if locations were passed from maps page
    useEffect(() => {
        if (location.state?.locations) {
            const { locations } = location.state;
            setForm(prev => ({
                ...prev,
                pickupLocation: locations.pickupLocation || prev.pickupLocation,
                dropOffLocation: locations.dropoffLocation || prev.dropOffLocation
            }));
        }
    }, [location.state]);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "carIds") {
            setForm((prev) => ({ ...prev, carIds: value ? [value] : [] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        
        // Validate required fields
        // Note: userId defaults to 1 for testing if no user is logged in
        
        if (!form.carIds || form.carIds.length === 0 || form.carIds[0] === "") {
            setMessage("Please select a car");
            setMessageType("error");
            return;
        }
        
        if (!form.startDate || !form.endDate) {
            setMessage("Start date and end date are required");
            setMessageType("error");
            return;
        }
        
        if (!form.pickupLocation || !form.dropOffLocation) {
            setMessage("Pickup and drop-off locations are required");
            setMessageType("error");
            return;
        }
        
        try {
            // Send data in the format backend expects
            const bookingData = {
                userId: form.userId,
                carIds: form.carIds,
                bookingDateAndTime: form.bookingDateAndTime,
                startDate: form.startDate,
                endDate: form.endDate,
                pickupLocation: form.pickupLocation,
                dropOffLocation: form.dropOffLocation,
                bookingStatus: form.bookingStatus || "PENDING"
            };
            
            console.log("Sending booking data:", bookingData);
            const response = await create(bookingData);
            console.log("Booking created - full response:", response);
            console.log("Booking response data:", response.data);
            console.log("Booking ID from response:", response.data?.bookingID);
            setMessage("Booking created successfully!");
            setMessageType("success");

            // Create notification for successful booking
            try {
                const bookingData = {
                    ...response.data,
                    car: selectedCar,
                    startDate: form.startDate,
                    endDate: form.endDate
                };
                await NotificationService.createBookingNotification(user, bookingData, 'BOOKED');
                console.log("Booking notification created successfully");
            } catch (notificationError) {
                console.error("Failed to create booking notification:", notificationError);
                // Don't fail the booking if notification fails
            }
            setForm({
                userId: user?.id || 1,
                carIds: [],
                bookingDateAndTime: "",
                startDate: "",
                endDate: "",
                pickupLocation: "",
                dropOffLocation: "",
                bookingStatus: "PENDING"
            });
            
            // Redirect to payment after successful creation with booking data
            // Calculate total amount based on rental period
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
                const bookingID = response.data?.bookingID;
                console.log("Navigating to payment with booking ID:", bookingID);
                
                navigate("/payment", {
                    state: { 
                        booking: {
                            bookingID: bookingID,
                            bookingDateAndTime: form.bookingDateAndTime,
                            startDate: form.startDate,
                            endDate: form.endDate,
                            bookingStatus: "PENDING",
                            car: selectedCar,
                            totalAmount: calculateTotalAmount(),
                            userId: form.userId // Pass user ID to payment page
                        }
                    }
                });
            }, 2000);
        } catch (err) {
            console.error("Error creating booking:", err);
            console.error("Error response:", JSON.stringify(err.response?.data, null, 2));
            console.error("Error status:", err.response?.status);
            console.error("Form data that was sent:", JSON.stringify(form, null, 2));
            console.error("Booking data that was sent:", JSON.stringify(bookingData, null, 2));
            
            let errorMessage = "Error creating booking.";
            
            if (err.response?.status === 400) {
                errorMessage = "Invalid booking data: " + (err.response?.data?.message || err.response?.data || "Please check all required fields");
            } else if (err.response?.status === 404) {
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
        <div className="form-group">
            <div className="w-full max-w-lg bg-black/90 rounded-xl shadow-lg p-8 mt-8">
                <h2 style={{}}>Make a Booking</h2>
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
                        <input type="datetime-local" name="bookingDateAndTime" value={form.bookingDateAndTime} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Start Date & Time *</label>
                        <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">End Date & Time *</label>
                        <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"/>
                    </div>
                    <div className="mb-4">
                        <LocationPicker
                            onLocationSelect={(location) => setForm(prev => ({ ...prev, pickupLocation: location }))}
                            selectedLocation={form.pickupLocation}
                            placeholder="Pick-up Location"
                        />
                    </div>
                    <div className="mb-4">
                        <LocationPicker
                            onLocationSelect={(location) => setForm(prev => ({ ...prev, dropOffLocation: location }))}
                            selectedLocation={form.dropOffLocation}
                            placeholder="Drop-off Location"
                        />
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
                                style={{backgroundColor: "#00ca09"}}
                                className="submit-btn">Submit</button>
                        <button type="reset"
                                style={{backgroundColor: "#003ffa"}}
                                className="submit-btn" onClick={() => setForm({
                            userId: user?.id || 1,
                            carIds: [],
                            bookingDateAndTime: "",
                            startDate: "",
                            endDate: "",
                            pickupLocation: "",
                            dropOffLocation: "",
                            bookingStatus: "PENDING"
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

export default BookingForm;
