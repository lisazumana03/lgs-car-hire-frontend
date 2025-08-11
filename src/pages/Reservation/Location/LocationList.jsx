import React, {useState} from 'react';
import './Location.css';
import axios from 'axios';

/*
Lisakhanya Zumana (230864821)
Date: 06/06/2025
 */

const LocationForm = () => {
    const [locations, setLocations] = useState({
        pickUpLocation: [],
        dropOffLocation: [],
    });
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setLocations({
            ...locations,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3045/api/lgs-car-hire/location', locations)
            .then(res => {
                setSuccess(res.data.message);
            })
            .catch(err => {
                console.log(err);
            });
    };
    return (
        <body>
        <div>
            <h1>Register Car Rental Location (both pick up and Return)</h1>
            <p> If you suggest a location, please add into the form. </p>
            <form onSubmit={handleSubmit}>
                <label>Pick Up Location:</label>
                <input type="text" name="pickUpLocation" onChange={handleChange} />
                <label>Drop Off Location:</label>
                <input type="text" name="dropOffLocation" onChange={handleChange} />
                <button type="submit">Submit</button>
                {success && <p>{success}</p>}
            </form>
        </div>
        </body>
    );
};

export default LocationForm;