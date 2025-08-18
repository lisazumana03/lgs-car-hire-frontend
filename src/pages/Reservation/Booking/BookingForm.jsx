/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */
import React, {useState, useEffect} from 'react';
import {create} from "../../../services/bookingService.js";
import './Booking.css';

function BookingForm() {
    const [booking, setBooking] = useState({})
    const [form, setForm] = useState({
        car: '',
        bookingDate: '',
        startDateTime: '',
        endDateTime: '',
        pickupLocation: '',
        dropOffLocation: '',
        bookingStatus: 'confirmed'
    });

    useEffect(() => {
        // This effect can be used to fetch initial data if needed
        // For example, fetching available cars or locations
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBooking = {
            car: form.car,
            bookingDate: form.bookingDate,
            startDateTime: form.startDateTime,
            endDateTime: form.endDateTime,
            pickupLocation: form.pickupLocation,
            dropoffLocation: form.dropoffLocation,
            bookingStatus: form.bookingStatus
        };

        create(newBooking)
            .then(response => {
                console.log("Booking created successfully:", response.data);
                setBooking(response.data);
                // Optionally reset the form or redirect
                setForm({
                    car: '',
                    bookingDate: '',
                    startDateTime: '',
                    endDateTime: '',
                    pickupLocation: '',
                    dropOffLocation: '',
                    bookingStatus: 'confirmed'
                });
            })
            .catch(error => {
                console.error("There was an error creating the booking!", error);
            });

    }

    return (
        <div>
            <h2> Make a Booking </h2>
            <form onSubmit={handleSubmit}>
                <label> Car being booked </label><br/>
                <input type="text" name="car" placeholder="Enter car name" value={form.car} required/><br/>
                <label> Booking Date </label><br/>
                <input type="date" name="bookingDate" required/><br/>
                <label> Start Date and Time</label><br/>
                <input type="datetime-local" name="startDateTime" required/><br/>
                <label> End Date and Time</label><br/>
                <input type="datetime-local" name="endDateTime" required/><br/>
                <label> Pick-up Location </label>
                <input type="choice" name="pickupLocation" required/><br/>
                <label> Drop-off Location </label>
                <input type="choice" name="dropoffLocation" required/><br/>
                <label> Booking Status </label><br/>
                <select name="bookingStatus" required>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                </select><br/>
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
                <button type="cancel">Cancel</button>
            </form>
        </div>
    );
}

export default BookingForm;