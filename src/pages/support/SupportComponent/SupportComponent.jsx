import { Link } from "react-router-dom";

export default function SupportComponent() {
    return (
        <div className="booking-container">
            <h1>Support Management</h1>
            <div className="booking-options">
                <div className="booking-card">
                    <h3>Submit a Query</h3>
                    <p>Let us know your questions or issues and our team will assist you promptly.</p>
                    <Link
                        to="/support-form"
                        className="booking-btn primary"
                    >
                        Submit a Query
                    </Link>
                </div>
                <div className="booking-card">
                    <h3>View Queries</h3>
                    <p>See previous support queries.</p>
                    <Link
                        to="/support-list"
                        className="booking-btn secondary"
                    >
                        View Queries
                    </Link>
                </div>
                <div className="booking-card">
                    <h3>Edit Support Tickets</h3>
                    <p>Edit or delete support tickets in the system.</p>
                    <Link
                        to="/support-edit-list"
                        className="booking-btn warning"
                    >
                        Edit Support Tickets
                    </Link>
                </div>
            </div>
        </div>
    );
}