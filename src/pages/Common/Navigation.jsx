import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
      <div className="flex">
        <nav className="text-white p-4">
            <Link to="/" className="text-white-700 hover:text-blue-600">
                Home
            </Link>
            <Link to="/make-booking" className="text-white-700 hover:text-blue-600">
                Make Booking
            </Link>
        </nav>
      </div>
  );
}

export default Navigation;