import {Link} from "react-router-dom";
import BookingForm from "../Reservation/Booking/BookingForm.jsx";

function Navigation(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-white">
            <div className="container">
                <BookingForm/>
            </div>
        </nav>
    );
}

export default Navigation;