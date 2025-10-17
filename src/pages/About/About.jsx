import HeroPages from "../../components/public/HeroPages";
import PlanTrip from "../../components/public/PlanTrip";
import AboutMain from "../../images-carrental/about/about-main.jpg";
import Box1 from "../../images-carrental/about/icon1.png";
import Box2 from "../../images-carrental/about/icon2.png";
import Box3 from "../../images-carrental/about/icon3.png";

function About() {
  return (
    <>
      <section className="about-page">
        <HeroPages name="About" />
        <div className="container">
          <div className="about-main">
            <img
              className="about-main__img"
              src={AboutMain}
              alt="car-renting"
            />
            <div className="about-main__text">
              <h3>About Company</h3>
              <h2>You start the engine and your adventure begins</h2>
              <p>
                At LGS Car Hire, we believe that every journey should be exceptional.
                With years of experience in the car rental industry, we've built a
                reputation for providing quality vehicles and outstanding customer service.
                Whether you're planning a business trip or a leisure getaway, we have
                the perfect vehicle to meet your needs.
              </p>
              <div className="about-main__text__icons">
                <div className="about-main__text__icons__box">
                  <img src={Box1} alt="car-icon" />
                  <span>
                    <h4>20</h4>
                    <p>Car Types</p>
                  </span>
                </div>
                <div className="about-main__text__icons__box">
                  <img src={Box2} alt="car-icon" />
                  <span>
                    <h4>85</h4>
                    <p>Rental Outlets</p>
                  </span>
                </div>
                <div className="about-main__text__icons__box">
                  <img src={Box3} alt="car-icon" className="last-fk" />
                  <span>
                    <h4>75</h4>
                    <p>Repair Shop</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <PlanTrip />
        </div>
      </section>
      <div className="book-banner">
        <div className="book-banner__overlay"></div>
        <div className="container">
          <div className="text-content">
            <h2>Book a car by getting in touch with us</h2>
            <span>
              <i className="fa-solid fa-phone"></i>
              <h3>(123) 456-7869</h3>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
