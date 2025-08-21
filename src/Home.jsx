import { Link } from "react-router-dom";

function Home(){
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full h-64 bg-[url('')] bg-cover bg-center">
            <p>The number one spot where you can rent a car of your dreams.</p>
            <Link to="/make-booking" className="mt-6 px-6 py-2 bg-red-800 text-white rounded shadow hover:bg-red-700 transition">Make Booking</Link>
        </div>
    );
}

export default Home;