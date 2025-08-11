import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Main from './pages/Main';
import './App.css'
import BookingForm from "./pages/Reservation/Booking/BookingForm.jsx";
import LocationForm from "./pages/Reservation/Location/LocationPicker.jsx";


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/home" element={<Main/>}/>
              <Route path="/make-booking" element={<BookingForm/>}/>
              <Route element></Route>
              <Route path="/create-location" element={<LocationForm/>}/>
              <Route></Route>
          </Routes>
      </Router>
  );
}

export default App
