/*
Imtiyaaz Waggie 219374759
 */


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../services/carService.js";
import { createCarType } from "../../services/carTypeService.js";

function CarForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        model: "",
        brand: "",
        year: "",
        availability: true,
        rentalPrice: "",
        insurance: false,
        imageUrl: "",
        carType: {
            type: "",
            fuelType: "",
            numberOfWheels: 4,
            numberOfSeats: 5
        }
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith("carType.")) {
            const field = name.split(".")[1];
            setForm(prev => ({
                ...prev,
                carType: {
                    ...prev.carType,
                    [field]: type === "checkbox" ? checked : 
                            field === "numberOfWheels" || field === "numberOfSeats" ? 
                            parseInt(value) || 0 : value
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : 
                        name === "year" ? parseInt(value) || "" : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const carTypeData = {
                type: form.carType.type,
                fuelType: form.carType.fuelType,
                numberOfWheels: form.carType.numberOfWheels,
                numberOfSeats: form.carType.numberOfSeats
            };

            const carTypeResponse = await createCarType(carTypeData);
            const createdCarType = carTypeResponse.data;

            const carData = {
                model: form.model,
                brand: form.brand,
                year: parseInt(form.year),
                availability: form.availability,
                rentalPrice: parseFloat(form.rentalPrice),
                insurance: form.insurance,
                imageUrl: form.imageUrl || null,
                carTypeID: createdCarType.carTypeID 
            };

            await create(carData);
            
            setMessage("Car registered successfully!");
            
            setForm({
                model: "",
                brand: "",
                year: "",
                availability: true,
                rentalPrice: "",
                insurance: false,
                imageUrl: "",
                carType: {
                    type: "",
                    fuelType: "",
                    numberOfWheels: 4,
                    numberOfSeats: 5
                }
            });
            
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error registering car:", err);
            const errorMessage = err.response?.data?.message || 
                                err.response?.data || 
                                err.message || 
                                "Error registering car";
            setMessage("Error: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            {message && (
                <p className={`mb-4 font-semibold ${
                    message.includes("Error") ? "text-red-700" : "text-green-700"
                }`}>
                    {message}
                </p>
            )}
            
            <form onSubmit={handleSubmit} className="bg-red-100 p-8 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Register New Car</h2>
                
                {/* Basic Car Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Brand *</label>
                        <input 
                            type="text" 
                            name="brand" 
                            value={form.brand} 
                            onChange={handleChange} 
                            placeholder="e.g., Toyota, BMW, Ford" 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black placeholder:text-gray-500"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Model *</label>
                        <input 
                            type="text" 
                            name="model" 
                            value={form.model} 
                            onChange={handleChange} 
                            placeholder="e.g., Camry, X5, Focus" 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black placeholder:text-gray-500"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Year *</label>
                        <input 
                            type="number" 
                            name="year" 
                            value={form.year} 
                            onChange={handleChange} 
                            placeholder="e.g., 2024" 
                            min="1900" 
                            max="2030" 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black placeholder:text-gray-500"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Rental Price (per day) *</label>
                        <input 
                            type="number" 
                            name="rentalPrice" 
                            value={form.rentalPrice} 
                            onChange={handleChange} 
                            placeholder="e.g., 850.00" 
                            step="0.01" 
                            min="0" 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* Image URL */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold text-black">Image URL (Optional)</label>
                    <input 
                        type="url" 
                        name="imageUrl" 
                        value={form.imageUrl} 
                        onChange={handleChange} 
                        placeholder="https://example.com/car-image.jpg" 
                        disabled={loading}
                        className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        Provide a URL to an image of the car (optional)
                    </p>
                </div>

                {/* Car Type Information */}
                <h3 className="text-lg font-bold mt-4 mb-2 text-black">Car Type Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Type *</label>
                        <select 
                            name="carType.type" 
                            value={form.carType.type} 
                            onChange={handleChange} 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black"
                        >
                            <option value="">Select Type</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Convertible">Convertible</option>
                            <option value="Minivan">Minivan</option>
                            <option value="Pickup">Pickup Truck</option>
                            <option value="Van">Van</option>
                            <option value="Sports">Sports Car</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Fuel Type *</label>
                        <select 
                            name="carType.fuelType" 
                            value={form.carType.fuelType} 
                            onChange={handleChange} 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black"
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Number of Wheels *</label>
                        <input 
                            type="number" 
                            name="carType.numberOfWheels" 
                            value={form.carType.numberOfWheels} 
                            onChange={handleChange} 
                            min="2" 
                            max="8" 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-black">Number of Seats *</label>
                        <input 
                            type="number" 
                            name="carType.numberOfSeats" 
                            value={form.carType.numberOfSeats} 
                            onChange={handleChange} 
                            min="1" 
                            max="20" 
                            required 
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 text-black"
                        />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                name="availability" 
                                checked={form.availability} 
                                onChange={handleChange} 
                                disabled={loading}
                                className="mr-2 disabled:bg-gray-100"
                            />
                            <span className="font-semibold text-black">Available for Rent</span>
                        </label>
                    </div>
                    
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                name="insurance" 
                                checked={form.insurance} 
                                onChange={handleChange} 
                                disabled={loading}
                                className="mr-2 disabled:bg-gray-100"
                            />
                            <span className="font-semibold text-black">Insurance Included</span>
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`px-4 py-2 rounded transition ${
                            loading 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                : 'bg-green-800 text-white hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Registering...' : 'Register Car'}
                    </button>
                    <button 
                        type="reset" 
                        disabled={loading}
                        className={`px-4 py-2 rounded transition ${
                            loading 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                        onClick={() => !loading && setForm({
                            model: "",
                            brand: "",
                            year: "",
                            availability: true,
                            rentalPrice: "",
                            insurance: false,
                            imageUrl: "",
                            carType: {
                                type: "",
                                fuelType: "",
                                numberOfWheels: 4,
                                numberOfSeats: 5
                            }
                        })}
                    >
                        Reset
                    </button>
                    <button 
                        type="button" 
                        disabled={loading}
                        className={`px-4 py-2 rounded transition ${
                            loading 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                : 'bg-blue-500 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => !loading && navigate("/")}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CarForm;