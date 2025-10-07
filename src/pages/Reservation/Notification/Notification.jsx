import { useEffect, useState } from "react";
import { getCurrentUserNotifications } from "../../../services/notificationService"; // Import notification service
import "../../../assets/styling/Notification.css"; // Import notification styles

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Get current user from session storage
                const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
                if (userStr) {
                    const currentUser = JSON.parse(userStr);
                    setUser(currentUser);
                }
                
                if (!userStr) {
                    setError("Please login to view notifications.");
                    setLoading(false);
                    return;
                }
                
                console.log("Loading notifications for user:", user);
                
                // Use the new function that gets current user ID automatically
                const response = await getCurrentUserNotifications();
                setNotifications(response || []);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Failed to load notifications. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    if (loading) return <p>Loading notifications...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="notification-container">
                <h2>Your Notifications</h2>
                {user && (
                    <div className="user-info-banner" style={{ 
                        padding: '15px', 
                        backgroundColor: 'transparent', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        border: '1px solid #555'
                    }}>
                        <p className="user-info" style={{ margin: 0, color: 'white' }}>
                            <strong>Logged in as:</strong> {user.name || user.email} 
                            {user.role && <span className="user-role"> ({user.role})</span>}
                            <span className="user-id" style={{ color: 'white', fontWeight: 'bold' }}> | User ID: {
                                console.log("User object in notification:", user) ||
                                console.log("User properties:", Object.keys(user)) ||
                                (user.id || user.userID || user.userId || user.ID || 'N/A')
                            }</span>
                        </p>
                    </div>
                )}
                {notifications.length === 0 ? (
                    <p>No notifications yet.</p>
                ) : (
                    <ul className="notification-list">
                        {notifications.map((n) => (
                            <li key={n.id || n.notificationID} className={`notification-item ${n.status?.toLowerCase() || 'unread'}`}>
                                <p><strong>{n.message}</strong></p>
                                <small>{new Date(n.createdAt || n.dateSent).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

