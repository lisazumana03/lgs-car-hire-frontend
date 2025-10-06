import { Link } from "react-router-dom";

export default function InsuranceComponent({ user }){
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-4">Insurance Management</h2>
            {user && (
                <div className="mb-8 p-4 bg-blue-900/50 border border-blue-500 rounded-xl max-w-md">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Welcome, {user.name}!</h3>
                    <p className="text-sm text-blue-200">User ID: {user.id}</p>
                </div>
            )}
            <div className="booking-links flex flex-col gap-6 mb-4 w-full max-w-md">
                <Link
                    to="/insurance-form"
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    Add Insurance
                </Link>
                <Link
                    to="/insurance-list"
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-800 text-xl font-semibold text-center transition duration-300 transform hover:scale-105"
                >
                    View Insurance Records
                </Link>
            </div>
        </div>
    );
}
