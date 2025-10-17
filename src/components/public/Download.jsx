import Img1 from "../../images-carrental/download/appstore.svg";
import Img2 from "../../images-carrental/download/googleapp.svg";

function Download() {
  return (
    <>
      <section className="download-section">
        <div className="container">
          <div className="download-text">
            <h2>Download our app to get most out of it</h2>
            <p>
              Experience seamless car rental booking on the go with our mobile app.
              Get exclusive deals, manage your bookings, and access 24/7 customer support
              right from your smartphone.
            </p>
            <div className="download-text__btns">
              <img alt="download_img" src={Img2} />
              <img alt="download_img" src={Img1} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Download;
