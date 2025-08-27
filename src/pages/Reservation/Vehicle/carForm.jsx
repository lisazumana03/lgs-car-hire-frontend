/*
Car Registration Form
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../../services/carService";

function CarForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        model: "",
        brand: "",
        year: "",
        availability: true,
        rentalPrice: "",
        insurance: false,
        // Car Type fields
        carType: {
            type: "",
            fuelType: "",
            numberOfWheels: 4,
            numberOfSeats: 5
        }
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle nested carType fields
        if (name.startsWith("carType.")) {
            const field = name.split(".")[1];
            setForm(prev => ({
                ...prev,
                carType: {
                    ...prev.carType,
                    [field]: type === "checkbox" ? checked : value
                }
            }));
        } else {
            // Handle regular fields
            setForm(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await create(form);
            setMessage("Car registered successfully!");
            // Reset form
            setForm({
                model: "",
                brand: "",
                year: "",
                availability: true,
                rentalPrice: "",
                insurance: false,
                carType: {
                    type: "",
                    fuelType: "",
                    numberOfWheels: 4,
                    numberOfSeats: 5
                }
            });
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Error registering car: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {message && (
                <p className={`mb-4 font-semibold ${
                    message.includes("Error") ? "text-red-700" : "text-green-700"
                }`}>
                    {message}
                </p>
            )}
            
            <form onSubmit={handleSubmit} className="bg-red-100 p-8 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Register New Car</h2>
                
                {/* Basic Car Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Brand</label>
                        <input 
                            type="text" 
                            name="brand" 
                            value={form.brand} 
                            onChange={handleChange} 
                            placeholder="e.g., Toyota, BMW, Ford" 
                            required 
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Model</label>
                        <input 
                            type="text" 
                            name="model" 
                            value={form.model} 
                            onChange={handleChange} 
                            placeholder="e.g., Camry, X5, Focus" 
                            required 
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Year</label>
                        <input 
                            type="number" 
                            name="year" 
                            value={form.year} 
                            onChange={handleChange} 
                            placeholder="e.g., 2024" 
                            min="1900" 
                            max="2030" 
                            required 
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Rental Price (per day)</label>
                        <input 
                            type="number" 
                            name="rentalPrice" 
                            value={form.rentalPrice} 
                            onChange={handleChange} 
                            placeholder="e.g., 50.00" 
                            step="0.01" 
                            min="0" 
                            required 
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>

                {/* Car Type Information */}
                <h3 className="text-lg font-bold mt-4 mb-2">Car Type Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Type</label>
                        <select 
                            name="carType.type" 
                            value={form.carType.type} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border rounded"
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
                        <label className="block mb-1 font-semibold">Fuel Type</label>
                        <select 
                            name="carType.fuelType" 
                            value={form.carType.fuelType} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border rounded"
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
                        <label className="block mb-1 font-semibold">Number of Wheels</label>
                        <input 
                            type="number" 
                            name="carType.numberOfWheels" 
                            value={form.carType.numberOfWheels} 
                            onChange={handleChange} 
                            min="2" 
                            max="8" 
                            required 
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Number of Seats</label>
                        <input 
                            type="number" 
                            name="carType.numberOfSeats" 
                            value={form.carType.numberOfSeats} 
                            onChange={handleChange} 
                            min="1" 
                            max="20" 
                            required 
                            className="w-full px-3 py-2 border rounded"
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
                                className="mr-2"
                            />
                            <span className="font-semibold">Available for Rent</span>
                        </label>
                    </div>
                    
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                name="insurance" 
                                checked={form.insurance} 
                                onChange={handleChange} 
                                className="mr-2"
                            />
                            <span className="font-semibold">Insurance Included</span>
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <button 
                        type="submit" 
                        className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Register Car
                    </button>
                    <button 
                        type="reset" 
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700" 
                        onClick={() => setForm({
                            model: "",
                            brand: "",
                            year: "",
                            availability: true,
                            rentalPrice: "",
                            insurance: false,
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
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" 
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CarForm;