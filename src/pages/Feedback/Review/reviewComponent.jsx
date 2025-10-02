import { Link } from "react-router-dom";

export default function ReviewComponent(){
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-8">Options</h2>
            <div className="booking-links flex flex-col gap-6 mb-4 w-full max-w-md">
                <Link
                    to="/review-form"
                    type="button"
                    style={{backgroundColor: "#ff0000"}}
                >
                    Write a Review
                </Link>
                <Link
                    to="/review-list"
                    type="button"
                    style={{backgroundColor: "#ff0000"}}
                >
                    View Customer Reviews
                </Link>
            </div>
        </div>
    );
}