import { Link } from "react-router-dom";
import "../assets/styling/home.css";
import homeImage from "../assets/samuel-hagger-qoZSYNBvIxg-unsplash.jpg";

function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>About LG'S CAR HIRE</h1>
                    <p>We are a premier car rental service dedicated to providing exceptional vehicles and outstanding customer service. With years of experience in the industry, we've built a reputation for reliability, quality, and customer satisfaction.</p>
                    <Link to="/register" className="btn">Get Started</Link>
                </div>
                <div className="hero-image">
                    <img src={homeImage} alt="Luxury Cars" />
                </div>
            </section>

            {/* About Content Section */}
            <section className="features">
                <div className="container">
                    <h2>Our Story</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Our Mission</h3>
                            <p>To provide reliable, affordable, and high-quality car rental services that exceed our customers' expectations while maintaining the highest standards of safety and professionalism.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Our Vision</h3>
                            <p>To become the leading car rental service provider, known for innovation, customer satisfaction, and contributing to sustainable transportation solutions.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Our Values</h3>
                            <p>Integrity, reliability, customer focus, and continuous improvement drive everything we do. We believe in building lasting relationships with our customers.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
