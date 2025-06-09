/*
Lisakhanya Zumana (230864821)
Date: 05/06/2025
 */
import React, {useState} from 'react';
import './Booking.css';

function Booking() {
    const [form, setForm] = useState({
        user: '',
        cars: [],
        pickupDate: '',
        returnDate: '',
        pickupLocation: '',
        returnLocation: '',
        totalCost: '',
    });
    return (
        <div className="Booking">
            <form>

            </form>
        </div>
    );
}

export default Booking;