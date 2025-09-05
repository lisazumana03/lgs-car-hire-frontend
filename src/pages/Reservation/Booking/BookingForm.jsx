/**
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
    const [messageType, setMessageType] = useState(""); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cars") {
            setForm((prev) => ({ ...prev, cars: [value] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (error) => {
        error.preventDefault();
        try {
            await create(form);
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
