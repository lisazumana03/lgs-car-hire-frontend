import { Link } from "react-router-dom";

function Home(){
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black-100 p-4">
            <p>The number one spot where you can rent a car of your dreams.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/make-booking" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition">Make Booking</Link>
                    <Link to="/locations" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> View Locations </Link>
                    <Link to="/cars" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> View Cars </Link>
                    <Link to="/queries" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> Submit a Query </Link>
                    <Link to="/payments" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> View Payment History </Link>
                    <Link to="/bookings" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> View Booking History </Link>
                </div>
        </div>
    );
}

export default Home;