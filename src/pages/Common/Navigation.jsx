import {Link} from "react-router-dom";

function Navigation(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-white">
            <div className="container">
                <Link to="/"></Link>
                <Link to="/make-booking">Make Booking</Link>
            </div>
        </nav>
    );
}

export default Navigation;