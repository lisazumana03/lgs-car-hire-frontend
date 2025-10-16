import { Link } from "react-router-dom";
import "../../assets/styling/home.css";
import homeImage from "../../assets/samuel-hagger-qoZSYNBvIxg-unsplash.jpg"

function Home(){
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Welcome to LG'S CAR HIRE</h1>
                    <p>Experience luxury car rentals with our premium fleet. From economy to luxury vehicles, we have the perfect car for your journey.</p>
                    <Link to="/register" className="btn">Get Started</Link>
                </div>
                <div className="hero-image">
                    <img src={homeImage}  alt="Luxury Cars" />
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Why Choose LG'S CAR HIRE?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Premium Fleet</h3>
                            <p>Choose from our wide selection of luxury and economy vehicles</p>
                        </div>
                        <div className="feature-card">
                            <h3>24/7 Support</h3>
                            <p>Round-the-clock customer support for all your needs</p>
                        </div>
                        <div className="feature-card">
                            <h3>Easy Booking</h3>
                            <p>Simple and secure online booking process</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;