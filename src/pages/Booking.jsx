/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */
import React, {useState} from 'react';
import axios from 'axios';
import './Booking.css';

const BookingForm = () => {
    const [booking, setBooking] = useState({
        user: '',
        car: [],
        bookingDate: '',
        pickUpDate: '',
        returnDate: '',
        pickUpLocation: '',
        returnLocation: '',
    });
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setBooking({
            ...booking,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3045/api/lgs-car-hire/booking', booking)
            .then(res => {
                setSuccess(res.data.message);
            })
            .catch(err => {
                console.log(err);
            });
    };
    return (
        <body>
        <div className="Booking">
            <form onSubmit={handleSubmit}>
                <h1>Make Your Booking</h1>
                <label>Car/s Booked:</label>
                <input type="text" name="car" onChange={handleChange} />
                <label>Booking Date:</label>
                <input type="date" name="bookingDate" onChange={handleChange} />
                <label>Pick Up Date:</label>
                <input type="date" name="pickUpDate" onChange={handleChange} />
                <label>Return Date:</label>
                <input type="date" name="returnDate" onChange={handleChange} />
                <label>Pick Up Location:</label>
                <input type="text" name="pickUpLocation" onChange={handleChange} />
                <label>Return Location:</label>
                <input type="text" name="returnLocation" onChange={handleChange} />
                <button type="submit">Submit</button>
                {success && <p>{success}</p>}
            </form>
        </div>
        </body>
    );
};

export default BookingForm;