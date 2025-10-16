/*
Lisakhanya Zumana
230864821
Updated: 2025-10-16 - Added insurance selection and proper backend structure alignment
 */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create, calculateRentalDays, calculateBookingTotals } from "../../../services/booking.service";
import { getAvailableCars } from "../../../services/car.service";
import { getAllInsurance } from "../../../services/insurance.service";
import { BookingStatus, CoverageType, CoverageTypeDisplay, CoverageTypeDescription, CoverageTypeCost } from "../../../constants/enums";

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
    const editingBooking = location.state?.booking;

    const [userId, setUserId] = useState(null);
    const [form, setForm] = useState({
        bookingDateAndTime: getCurrentDateTime(),
        startDate: "",
        endDate: "",
        insurance: null,
        bookingStatus: BookingStatus.PENDING
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [cars, setCars] = useState([]);
    const [insurances, setInsurances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [carsLoading, setCarsLoading] = useState(true);
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

    // Fetch available cars and insurances
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCarsLoading(true);
                setInsurancesLoading(true);

                const [carsResponse, insurancesResponse] = await Promise.all([
                    getAvailableCars(),
                    getAllInsurance()
                ]);

                setCars(carsResponse.data || []);
                setInsurances(insurancesResponse || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage("Failed to load data. Please try again.");
                setMessageType("error");
            } finally {
                setCarsLoading(false);
                setInsurancesLoading(false);
            }
        };

        fetchData();
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

    const isStartDateValid = !form.startDate || form.startDate >= form.bookingDateAndTime;
    const isEndDateValid = !form.endDate || form.endDate > form.startDate;

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        if (!selectedCar) {
            setMessage("Please select a car.");
            setMessageType("error");
            return;
        }

        if (!selectedPickupLocation || !selectedDropOffLocation) {
            setMessage("Please select pickup and drop-off locations.");
            setMessageType("error");
            return;
        }

        setLoading(true);

        // Prepare payload matching backend Booking entity structure
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

        console.log('Submitting booking with payload:', payload);

        try {
            const response = await create(payload);
            console.log("Booking created:", response);
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
            let errorMessage = "Error creating booking.";

            if (err.response?.status === 404) {
                errorMessage = "Booking endpoint not found. Please check if the backend is running correctly.";
            } else if (err.response?.status === 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (err.message) {
                errorMessage = err.message;
            }

            setMessage(errorMessage);
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
    };

    return (
        <div className="form-group">
            <div className="w-full max-w-2xl bg-black/90 rounded-xl shadow-lg p-8 mt-8 mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Make a Booking</h2>

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
                    {/* Selected Car */}
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
                                        onClick={() => navigate('/select-car', { state: location.state })}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Change Car
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

                    {/* Booking Date & Time */}
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

                    {/* Start Date & Time */}
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

                    {/* End Date & Time */}
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

                    {/* Pick-up Location */}
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Pick-up Location *</label>
                        {selectedPickupLocation ? (
                            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-2">
                                <h3 className="text-lg font-semibold text-white">{selectedPickupLocation.locationName}</h3>
                                <p className="text-gray-300">{selectedPickupLocation.streetNumber} {selectedPickupLocation.streetName}, {selectedPickupLocation.cityOrTown}</p>
                                <p className="text-gray-300">{selectedPickupLocation.provinceOrState}, {selectedPickupLocation.country}</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/choose-location', { state: { ...location.state, locationType: 'pickup' } })}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-2"
                                >
                                    Change Location
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate('/choose-location', { state: { ...location.state, locationType: 'pickup' } })}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Choose Pick-up Location
                            </button>
                        )}
                    </div>

                    {/* Drop-off Location */}
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-white">Drop-off Location *</label>
                        {selectedDropOffLocation ? (
                            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-2">
                                <h3 className="text-lg font-semibold text-white">{selectedDropOffLocation.locationName}</h3>
                                <p className="text-gray-300">{selectedDropOffLocation.streetNumber} {selectedDropOffLocation.streetName}, {selectedDropOffLocation.cityOrTown}</p>
                                <p className="text-gray-300">{selectedDropOffLocation.provinceOrState}, {selectedDropOffLocation.country}</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/choose-location', { state: { ...location.state, locationType: 'dropoff' } })}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-2"
                                >
                                    Change Location
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate('/choose-location', { state: { ...location.state, locationType: 'dropoff' } })}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Choose Drop-off Location
                            </button>
                        )}
                    </div>

                    {/* Insurance Selection */}
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-white">Insurance Coverage</label>
                        {insurancesLoading ? (
                            <p className="text-gray-400">Loading insurance options...</p>
                        ) : (
                            <div className="space-y-3">
                                {/* No Insurance Option */}
                                <div
                                    onClick={() => handleInsuranceSelect("none")}
                                    className={`border rounded-lg p-4 cursor-pointer transition ${
                                        !selectedInsurance
                                            ? 'border-blue-500 bg-blue-900/30'
                                            : 'border-gray-600 bg-gray-700/30'
                                    } hover:border-blue-400`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-white">No Insurance</h4>
                                            <p className="text-sm text-gray-300">No additional coverage</p>
                                        </div>
                                        <span className="text-white font-bold">R0/day</span>
                                    </div>
                                </div>

                                {/* Available Insurance Options */}
                                {insurances.filter(ins => ins.isActive).map((insurance) => (
                                    <div
                                        key={insurance.insuranceID}
                                        onClick={() => handleInsuranceSelect(insurance.insuranceID.toString())}
                                        className={`border rounded-lg p-4 cursor-pointer transition ${
                                            selectedInsurance?.insuranceID === insurance.insuranceID
                                                ? 'border-blue-500 bg-blue-900/30'
                                                : 'border-gray-600 bg-gray-700/30'
                                        } hover:border-blue-400`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white">
                                                    {CoverageTypeDisplay[insurance.coverageType] || insurance.coverageType}
                                                </h4>
                                                <p className="text-sm text-gray-300 mb-2">
                                                    {CoverageTypeDescription[insurance.coverageType]}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Provider: {insurance.insuranceProvider}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Deductible: R{insurance.deductible.toLocaleString()}
                                                </p>
                                            </div>
                                            <span className="text-white font-bold">R{insurance.insuranceCost}/day</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cost Summary */}
                    {calculatedCosts && (
                        <div className="mb-4 bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Cost Summary</h3>
                            <div className="space-y-2 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Rental ({calculatedCosts.rentalDays} days @ R{selectedCar.rentalPrice}/day)</span>
                                    <span>R{(selectedCar.rentalPrice * calculatedCosts.rentalDays).toFixed(2)}</span>
                                </div>
                                {selectedInsurance && (
                                    <div className="flex justify-between">
                                        <span>Insurance ({calculatedCosts.rentalDays} days @ R{selectedInsurance.insuranceCost}/day)</span>
                                        <span>R{(selectedInsurance.insuranceCost * calculatedCosts.rentalDays).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-gray-600 pt-2">
                                    <span>Subtotal</span>
                                    <span>R{calculatedCosts.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (15% VAT)</span>
                                    <span>R{calculatedCosts.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-600 pt-2 text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>R{calculatedCosts.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{display: "flex", marginTop: "20px", gap: "10px"}}>
                        <button
                            type="submit"
                            disabled={!userId || loading}
                            style={{
                                backgroundColor: userId && !loading ? "#00ca09" : "#666",
                                cursor: userId && !loading ? "pointer" : "not-allowed",
                                opacity: userId && !loading ? 1 : 0.6
                            }}
                            className="submit-btn flex-1"
                            title={!userId ? "Please login to submit booking" : "Submit booking"}
                        >
                            {loading ? "Creating Booking..." : "Submit"}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            style={{backgroundColor: "#003ffa"}}
                            className="submit-btn flex-1"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/bookings")}
                            disabled={loading}
                            style={{backgroundColor: "#ff0000"}}
                            className="submit-btn flex-1"
                        >
                            Back
                        </button>
                    </div>

                    {/* Messages */}
                    {message && (
                        <p className={`mt-4 px-4 py-2 rounded border ${
                            messageType === "success"
                                ? "bg-[#1e4d2b] text-green-400 border-green-500"
                                : "bg-[#4c1d1d] text-red-400 border-red-500"
                        }`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
