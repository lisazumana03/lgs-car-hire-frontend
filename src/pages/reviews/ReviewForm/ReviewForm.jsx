import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllCars } from "../../../services/car.service";

function ReviewForm({ onAdd }) {
  const [form, setForm] = useState({ fullName: "", comment: "", rating: 0, carID: "" });
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCars().then(res => {
      setCars(res.data || []);
    }).catch(() => setCars([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    fullName: form.fullName,
    comment: form.comment,
    rating: form.rating,
    car: { carID: form.carID }   // <-- Wrap carID here
  };

  axios.post("http://localhost:3045/review/create", payload)
    .then(res => {
      if (onAdd) onAdd(res.data);
      alert("Review submitted successfully!");
      setForm({ fullName: "", comment: "", rating: 0, carID: "" });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to submit review. Please try again.");
    });
};

  return (
    <div className="form" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(120deg, #232526 0%, #414345 100%)'}}>
      <div style={{width: '100%', maxWidth: '480px', background: 'rgba(30, 41, 59, 0.98)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: '2.5rem', marginTop: '2rem'}}>
  <h2 style={{fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: '2rem', letterSpacing: '1px'}}>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1.5rem'}}>
            <label htmlFor="carID" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24'}}>Select Car *</label>
            <select id="carID" name="carID" value={form.carID} onChange={handleChange} required style={{width: '100%', padding: '0.75rem', border: '1px solid #64748B', borderRadius: '8px', background: '#334155', color: '#F1F5F9', fontSize: '1rem', outline: 'none'}}>
              <option value="" disabled>Select a car</option>
              {cars.map(car => (
                <option key={car.carID || car.id} value={car.carID || car.id}>
                  {car.brand} {car.model} ({car.year})
                </option>
              ))}
            </select>
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <label htmlFor="fullName" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24'}}>Your Name *</label>
            <input type="text" id="fullName" name="fullName" value={form.fullName}
              onChange={handleChange} placeholder="Enter your Full Name"
              style={{width: '100%', padding: '0.75rem', border: '1px solid #64748B', borderRadius: '8px', background: '#334155', color: '#F1F5F9', fontSize: '1rem', outline: 'none', letterSpacing: '0.5px'}} required />
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <label htmlFor="comment" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24'}}>Your Review *</label>
            <textarea id="comment" name="comment" value={form.comment}
              onChange={handleChange} placeholder="Write your review here..."
              style={{width: '100%', padding: '0.75rem', border: '1px solid #64748B', borderRadius: '8px', background: '#334155', color: '#F1F5F9', fontSize: '1rem', outline: 'none', letterSpacing: '0.5px'}} rows={4} required />
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <label htmlFor="rating" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24'}}>Rating (1-5) *</label>
            <input type="number" id="rating" name="rating" value={form.rating}
              onChange={handleChange} placeholder="Rating (1-5)"
              style={{width: '100%', padding: '0.75rem', border: '1px solid #64748B', borderRadius: '8px', background: '#334155', color: '#F1F5F9', fontSize: '1rem', outline: 'none', letterSpacing: '0.5px'}} min="1" max="5" required />
          </div>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
            <button type="submit" style={{background: 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(248,113,113,0.15)', cursor: 'pointer', transition: 'background 0.2s'}}>
              Submit
            </button>
            <button
              type="reset"
              style={{background: 'linear-gradient(90deg, #64748B 0%, #334155 100%)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(100,116,139,0.15)', cursor: 'pointer', transition: 'background 0.2s'}}
              onClick={e => {
                e.preventDefault();
                setForm({ fullName: "", comment: "", rating: 0, carID: "" });
              }}
            >
              Reset
            </button>
            <button type="button" style={{background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(59,130,246,0.15)', cursor: 'pointer', transition: 'background 0.2s'}} onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
