/*
Lisakhanya Zumana (230864821)
Date: 31/08/2025
 */
import { Link, useNavigate } from "react-router-dom";
import "./BookingComponent.css";

export default function BookingComponent(){
    const navigate = useNavigate();

    const bookingOptions = [
        {
            id: 'browse-cars',
            title: 'Browse Cars',
            description: 'Explore our premium fleet and find your perfect vehicle with detailed specifications and pricing.',
            path: '/cars',
            variant: 'primary',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H9L11 8H20C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
            )
        },
        {
            id: 'make-booking',
            title: 'Make a Booking',
            description: 'Create a new car rental reservation with your preferred vehicle, dates, and pickup location.',
            path: '/make-booking',
            variant: 'success',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V6M8 2V6M3 10H21M12 14H12.01M12 18H12.01M8 14H8.01M16 14H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 'booking-history',
            title: 'Booking History',
            description: 'View your past and current reservations, track booking status, and manage your rentals.',
            path: '/booking-history',
            variant: 'warning',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 'manage-bookings',
            title: 'Manage Bookings',
            description: 'Admin access to view, modify, and manage all bookings across the system.',
            path: '/booking-list',
            variant: 'info',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        }
    ];

    return (
        <div className="booking-management-container">
            <div className="booking-options-grid">
                {bookingOptions.map((option) => (
                    <div key={option.id} className={`booking-option-card ${option.variant}`}>
                        <div className="booking-card-header">
                            <div className="booking-card-icon">
                                {option.icon}
                            </div>
                            <h3>{option.title}</h3>
                        </div>
                        <div className="booking-card-body">
                            <p>{option.description}</p>
                            <Link to={option.path} className="booking-card-action">
                                {option.title}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}