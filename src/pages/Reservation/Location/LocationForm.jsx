/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../../services/locationService";

function LocationForm(){
    const navigate  = useNavigate();
    const [form, setForm] = useState({
        locationName: "",
        streetName: "",
        cityOrTown: "",
        provinceOrState: "", // Make sure this matches your Java class!
        country: "",
        postalCode: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await create(form);
            setMessage("Location created successfully!");
            setForm({
                locationName: "",
                streetName: "",
                cityOrTown: "",
                provinceOrState: "",
                country: "",
                postalCode: "",
            });
        } catch (err) {
            setMessage("Error creating location.");
        }
    };

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {message && <p className="mb-4 text-green-700 font-semibold">{message}</p>}
            <form onSubmit={handleSubmit} className="bg-red-100 p-8 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Location Name</label>
                    <input type="text" name="locationName" value={form.locationName} onChange={handleChange} placeholder="Enter location name" required className="w-full px-3 py-2 border rounded"/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Street Name</label>
                    <input type="text" name="streetName" value={form.streetName} onChange={handleChange} placeholder="Enter street name" required className="w-full px-3 py-2 border rounded"/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">City or Town</label>
                    <input type="text" name="cityOrTown" value={form.cityOrTown} onChange={handleChange} placeholder="Enter city or town" required className="w-full px-3 py-2 border rounded"/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Province</label>
                    <input type="text" name="provinceOrState" value={form.provinceOrState} onChange={handleChange} placeholder="Enter province" className="w-full px-3 py-2 border rounded"/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Country</label>
                    <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="Enter country" required className="w-full px-3 py-2 border rounded"/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Postal Code</label>
                    <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Enter postal code" required className="w-full px-3 py-2 border rounded"/>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                <button type="button" className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={() => navigate("/")}>Back</button>
            </form>
        </div>
    );
}

export default LocationForm;