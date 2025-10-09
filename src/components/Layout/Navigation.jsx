import { useState } from "react";
import { Link } from "react-router-dom";

function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Hamburger Button */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <span
          className={`block h-1 w-8 bg-white mb-1 rounded transition-all ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block h-1 w-8 bg-white mb-1 rounded transition-all ${
            open ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block h-1 w-8 bg-white rounded transition-all ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute md:static top-12 left-0 w-40 bg-red-900 md:bg-transparent md:w-auto z-50 rounded shadow-md md:shadow-none ${
          open ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0 space-y-2 md:space-y-0">
          <Link
            to="/"
            className="text-white hover:text-blue-300"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/make-booking"
            className="text-white hover:text-blue-300"
            onClick={() => setOpen(false)}
          >
            Make Booking
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;