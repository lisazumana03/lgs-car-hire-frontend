import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReviewEditList() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", comment: "", rating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReviews = () => {
    setLoading(true);
    axios.get("http://localhost:3045/review/all")
      .then(res => {
        setReviews(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setLoading(false);
        setError('Failed to load reviews.');
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEditClick = (review) => {
    setEditingId(review.reviewID);
    setEditForm({
      fullName: review.fullName,
      comment: review.comment,
      rating: review.rating,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send editable fields and reviewID
      const payload = {
        reviewID: editingId,
        fullName: editForm.fullName,
        comment: editForm.comment,
        rating: editForm.rating
      };
      await axios.put("http://localhost:3045/review/update", payload);
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      alert('Failed to update review.');
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      axios.delete(`http://localhost:3045/review/delete/${id}`)
        .then(fetchReviews)
        .catch(console.error);
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <h1 style={{marginBottom: '30px'}}>Edit or Delete Reviews</h1>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px'}}>
          <button onClick={() => navigate(-1)} style={{padding: '8px 18px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>Back</button>
          <button onClick={fetchReviews} style={{padding: '8px 18px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>Refresh</button>
        </div>
        {loading && <p>Loading reviews...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
          {reviews.map((review) => (
            <div key={review.reviewID} className="stat-card" style={{backgroundColor: '#3a3a3a', color: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '25px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginRight: '15px', boxShadow: '0 2px 8px rgba(0,123,255,0.2)'}}>
                  {review.fullName ? review.fullName.charAt(0) : '?'}
                </div>
                <div>
                  <span style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#4ade80'}}>{review.fullName}</span>
                  <span style={{display: 'block', fontSize: '0.9rem', color: '#aaa', marginTop: '2px'}}>Review ID: {review.reviewID}</span>
                </div>
              </div>
              <div style={{marginBottom: '10px'}}>
                <span style={{color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold'}}>{Array(review.rating).fill('★').join('')}</span>
                <span style={{color: '#aaa', fontSize: '0.95rem', marginLeft: '8px'}}>({review.rating}/5)</span>
              </div>
              <p style={{fontStyle: 'italic', color: 'white', fontSize: '1rem', marginTop: '10px'}}>{review.comment}</p>
              {editingId === review.reviewID && (
                <form onSubmit={handleEditSubmit} style={{marginTop: '15px'}}>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    style={{width: '100%', marginBottom: '8px', padding: '8px', borderRadius: '6px', border: '1px solid #aaa'}} required
                  />
                  <textarea
                    name="comment"
                    value={editForm.comment}
                    onChange={handleEditChange}
                    rows={3}
                    style={{width: '100%', marginBottom: '8px', padding: '8px', borderRadius: '6px', border: '1px solid #aaa'}} required
                  />
                  <input
                    type="number"
                    name="rating"
                    value={editForm.rating}
                    onChange={handleEditChange}
                    min="1"
                    max="5"
                    style={{width: '100%', marginBottom: '8px', padding: '8px', borderRadius: '6px', border: '1px solid #aaa'}} required
                  />
                  <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                    <button type="submit" style={{background: '#4ade80', color: 'white', padding: '8px 18px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>Save</button>
                    <button type="button" style={{background: '#aaa', color: 'white', padding: '8px 18px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              )}
              <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                <button style={{background: '#007bff', color: 'white', padding: '8px 18px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleEditClick(review)}>Edit</button>
                <button style={{background: '#dc2626', color: 'white', padding: '8px 18px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleDelete(review.reviewID)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewEditList;
