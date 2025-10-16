
import { Link } from "react-router-dom";
import "../../assets/styling/home.css";
import homeImage from "../../assets/samuel-hagger-qoZSYNBvIxg-unsplash.jpg"

export default function Contact(){
    return(
        <div className="contact-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Contact LG'S CAR HIRE</h1>
                    <p>Get in touch with us for any inquiries, bookings, or support. We're here to help you with all your car rental needs.</p>
                    <Link to="/register" className="btn">Get Started</Link>
                </div>
                <div className="hero-image">
                    <img src={homeImage} alt="Luxury Cars" />
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="features">
                <div className="container">
                    <h2>Get In Touch</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Phone</h3>
                            <p>Call us at: +27 (0) 11 123 4567<br/>Available 24/7 for your convenience</p>
                        </div>
                        <div className="feature-card">
                            <h3>Email</h3>
                            <p>Email us at: info@lgscarhire.co.za<br/>We'll respond within 24 hours</p>
                        </div>
                        <div className="feature-card">
                            <h3>Location</h3>
                            <p>Visit us at: 123 Main Street<br/>Johannesburg, South Africa</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}