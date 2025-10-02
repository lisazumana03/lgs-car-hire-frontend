import { Link } from "react-router-dom";

export default function ReviewComponent() {
    return (
        <div className="booking-container">
            <h1>Review Management</h1>
            <div className="booking-options">
                <div className="booking-card">
                    <h3>Write a Review</h3>
                    <p>Share your experience with our service and help others make informed decisions.</p>
                    <Link
                        to="/review-form"
                        className="booking-btn primary"
                    >
                        Write a Review
                    </Link>
                </div>
                <div className="booking-card">
                    <h3>View Customer Reviews</h3>
                    <p>Read feedback from other customers about their rental experiences.</p>
                    <Link
                        to="/review-list"
                        className="booking-btn secondary"
                    >
                        View Customer Reviews
                    </Link>
                </div>
                <div className="booking-card">
                    <h3>Manage reviews</h3>
                    <p>Admin updates or remove previous reviews from the system.</p>
                    <Link
                        to="/edit-reviews"
                        className="booking-btn tertiary"
                    >
                        Edit/Delete Reviews
                    </Link>
                </div>
            </div>
        </div>
    );
}