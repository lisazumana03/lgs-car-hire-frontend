import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Main from './pages/Main';
import Location from './pages/Location';
import './App.css'
import BookingForm from "./pages/Booking";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/home" element={<Main/>}/>
              <Route path="/booking" element={<BookingForm/>}/>
              <Route element></Route>
              <Route path="/location" element={<LocationForm/>}/>
              <Route></Route>
          </Routes>
      </Router>
  );
}

export default App
