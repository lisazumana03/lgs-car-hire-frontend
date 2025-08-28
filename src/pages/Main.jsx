import React, {useEffect ,useState} from 'react';
import './Main.css';
import {Link} from "react-router-dom";

function Main(){
    const [message, setMessage] = useState("Booting up...");
    useEffect(() => {
        fetch('http://localhost:3045/api/lgs-car-hire/main')
            .then(response => response.text())
            .then(data => setMessage(data.message))
            .catch(error => {
                console.log("Error fetching message: ",error);
                setMessage("The perfect place to rent a car by far.");
            });
    }, []);
    return(
        <div className="main-page">
            <h1>Welcome to the Car Hire System</h1>
            <p>{message}</p>
            <Link to="/make-booking" className="link-button">Make Your Booking</Link> | <Link to="/admin/booking" className="link-button">Admin</Link>
            <Link to="/location" className="link-button">Register Car Rental Location</Link> |
            <Link to="/car" className="link-button">Look at our Cars</Link> |
            <Link to="/review" className="link-button">Submit A Review</Link> |
            <Link to="/login" className="link-button">Login</Link> |
            <Link to="/register" className="link-button">Sign Up</Link> |
        </div>
    );
}

export default Main;
