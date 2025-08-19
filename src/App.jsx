import './App.css'
import Header from "./pages/Common/Header.jsx";
import Footer from "./pages/Common/Footer.jsx";
import Navigation from "./pages/Common/Navigation.jsx";


function App() {
  return (
      <>
      <Header/>
          <Navigation/>
          <main>
                <div className="container">
                    <h2>Welcome to LG's Car Hire</h2>
                    <p>Your one-stop solution for all your car rental needs.</p>
                </div>
          </main>
      <Footer/>
      </>
  );
}

export default App
