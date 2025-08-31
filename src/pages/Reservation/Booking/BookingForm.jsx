/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../../services/bookingService";

function BookingForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        cars: [""],
        bookingDateAndTime: "",
        startDate: "",
        endDate: "",
        pickupLocation: "",
        dropOffLocation: "",
        bookingStatus: "pending"
    });
    const [message, setMessage] = useState("");

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
        try {
            await create(form);
            setMessage("Booking created successfully!");
            setForm({
                cars: [""],
                bookingDateAndTime: "",
                startDate: "",
                endDate: "",
                pickupLocation: "",
                dropOffLocation: "",
                bookingStatus: "pending"
            });
        } catch (err) {
            setMessage("Error creating booking.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="w-full max-w-lg bg-white/90 rounded-xl shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-bold text-center text-red-700 mb-6">Make a Booking</h2>
                {message && <p className="mb-4 text-center text-green-700 font-semibold">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Car being booked</label>
                        <input type="text" name="cars" value={form.cars[0]} onChange={handleChange} placeholder="Enter car name or ID" required className="w-full px-3 py-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Booking Date & Time</label>
                        <input type="datetime-local" name="bookingDateAndTime" value={form.bookingDateAndTime} onChange={handleChange} required className="w-full px-3 py-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Start Date & Time</label>
                        <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">End Date & Time</label>
                        <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Pick-up Location</label>
                        <input type="text" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required className="w-full px-3 py-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Drop-off Location</label>
                        <input type="text" name="dropOffLocation" value={form.dropOffLocation} onChange={handleChange} required className="w-full px-3 py-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Booking Status</label>
                        <select name="bookingStatus" value={form.bookingStatus} onChange={handleChange} required className="w-full px-3 py-2 border rounded">
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900">Submit</button>
                        <button type="reset" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setForm({
                            cars: [""],
                            bookingDateAndTime: "",
                            startDate: "",
                            endDate: "",
                            pickupLocation: "",
                            dropOffLocation: "",
                            bookingStatus: "pending"
                        })}>Reset</button>
                        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => navigate("/dashboard")}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;