import React, {useEffect ,useState} from 'react';
import './Main.css';
import {Link} from "react-router-dom";

function Main(){
    const [message, setMessage] = useState("Booting up...");
    useEffect(() => {
        fetch('http://localhost:3045/lgs-car-hire/main')
            .then(response => response.text())
            .then(data => setMessage(data.message))
            .catch(error => {
                console.log("Error fetching message: ",error);
                setMessage("Failed to fetch message.");
            });
    }, []);
    return(
        <div className="main-page">
            <h1>Welcome to the Car Hire System</h1>
            <p>{message}</p>
            <Link to="/booking" className="link-button">Make Your Booking</Link>
        </div>
    );
}

export default Main;
