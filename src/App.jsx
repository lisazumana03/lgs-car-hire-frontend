import Header from "./pages/Common/Header.jsx";
import Footer from "./pages/Common/Footer.jsx";
import Home from "./Home.jsx";
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import {Route, Router, Routes} from "react-router-dom";


function App() {
  return (
      <Router>
          <div className="flex">
              <Header/>
              <main>
                  <Routes>
                      <Route path="/" component={<Home/>} />
                      <Route path="/make-booking" component={<BookingForm/>}/>
                  </Routes>
              </main>
              <Footer/>
          </div>
      </Router>
  );
}

export default App
