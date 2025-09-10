/**
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { create } from "../../../services/bookingService";
import { getAvailableCars } from "../../../services/carService";

function BookingForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCar = location.state?.selectedCar;
    
    const [form, setForm] = useState({
        cars: [selectedCar?.carID || ""],
        bookingDateAndTime: "",
        startDate: "",
        endDate: "",
        pickupLocation: "",
        dropOffLocation: "",
        bookingStatus: "pending"
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cars") {
            setForm((prev) => ({ ...prev, cars: [value] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        
    const handleSubmit = async (error) => {
        error.preventDefault();
        try {
            const response = await create(form);
            console.log("Booking created:", response.data);
            setMessage("Booking created successfully!");
            setMessageType("success");
            setForm({
                cars: [""],
                bookingDateAndTime: "",
                startDate: "",
                endDate: "",
                pickupLocation: "",
                dropOffLocation: "",
                bookingStatus: "pending"
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
        } catch (error) {
            setMessage("Error creating booking.");
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
                        <label className="block mb-1 font-semibold text-white">Pick-up Location *</label>
                        <input type="text" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none" placeholder="Enter pickup location"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Drop-off Location *</label>
                        <input type="text" name="dropOffLocation" value={form.dropOffLocation} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none" placeholder="Enter drop-off location"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Booking Status *</label>
                        <select name="bookingStatus" value={form.bookingStatus} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none">
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div style={{display: "flex", marginTop: "20px", gap: "10px"}}>
                        <button type="submit"
                                style={{backgroundColor: "#00ca09"}}
                                className="submit-btn">Submit</button>
                        <button type="reset"
                                style={{backgroundColor: "#003ffa"}}
                                className="submit-btn" onClick={() => setForm({
                            cars: [""],
                            bookingDateAndTime: "",
                            startDate: "",
                            endDate: "",
                            pickupLocation: "",
                            dropOffLocation: "",
                            bookingStatus: "pending"
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
