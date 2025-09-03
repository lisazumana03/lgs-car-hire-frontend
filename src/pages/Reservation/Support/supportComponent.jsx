import { Link } from "react-router-dom";

export default function ReviewComponent(){
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-8">Options</h2>
            <div className="booking-links flex flex-col gap-6 mb-4 w-full max-w-md">
                <Link
                    to="/support-form"
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    Submit a Query
                </Link>
                <Link
                    to="/support-list"
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    View Queries
                </Link>
            </div>
        </div>
    );
}