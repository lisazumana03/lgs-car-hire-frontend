import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Main from './pages/Main';
import Booking from './pages/Booking';
import Location from './pages/Location';
import './App.css'

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/home" element={<Main/>}/>
              <Route path="/booking" element={<Booking/>}/>
              <Route element></Route>
              <Route path="/location" element={<Location/>}/>
              <Route></Route>
          </Routes>
      </Router>
  );
}

export default App
