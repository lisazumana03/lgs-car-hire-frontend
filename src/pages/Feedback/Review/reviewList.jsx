import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchReviews = () => {
        setLoading(true);
        axios.get('http://localhost:3045/review/all')
            .then(res => {
                setReviews(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load reviews.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="main-content" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(120deg, #232526 0%, #414345 100%)'}}>
            <div className="dashboard-container" style={{width: '100%', maxWidth: '900px', background: 'rgba(30, 41, 59, 0.98)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: '2.5rem', marginTop: '2rem'}}>
                <h1 style={{marginBottom: '30px', color: '#fff', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px'}}>Customer Reviews</h1>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px'}}>
                    <button onClick={() => navigate(-1)} style={{padding: '8px 18px', background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Back</button>
                    <button onClick={fetchReviews} style={{padding: '8px 18px', background: 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Refresh</button>
                </div>
                {loading && <p style={{color: '#fff', textAlign: 'center'}}>Loading reviews...</p>}
                {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginTop: '2rem'}}>
                    {reviews.length === 0 && !loading ? (
                        <div style={{color: '#fff', textAlign: 'center', fontSize: '1.2rem'}}>No reviews found.</div>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id || review._id || review.reviewID} style={{background: 'linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)', borderRadius: '22px', boxShadow: '0 8px 32px rgba(30,41,59,0.18)', margin: '0 auto', maxWidth: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: '40px', border: '1px solid #e5e7eb'}}>
                                <div style={{background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', padding: '26px 36px', display: 'flex', alignItems: 'center', borderTopLeftRadius: '22px', borderTopRightRadius: '22px'}}>
                                    <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#fff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2.2rem', marginRight: '26px', boxShadow: '0 2px 8px rgba(59,130,246,0.15)'}}>
                                        {review.fullName ? review.fullName.charAt(0) : '?'}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <span style={{fontWeight: 'bold', fontSize: '1.35rem', color: '#fff', letterSpacing: '0.5px'}}>{review.fullName || 'Anonymous'}</span>
                                        <span style={{display: 'block', fontSize: '1rem', color: '#e0e7ef', marginTop: '2px'}}>Review ID: {review.reviewID || review.id || review._id}</span>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{background: 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)', borderRadius: '10px', padding: '8px 20px', fontSize: '1.08rem', marginLeft: '16px', boxShadow: '0 2px 8px rgba(251,191,36,0.12)'}}>
                                            <span style={{color: '#FFD700', fontWeight: 'bold'}}>{Array(review.rating).fill('★').join('')}</span> <span style={{fontWeight: 'normal', color: '#334155'}}>({review.rating}/5)</span>
                                        </span>
                                    </div>
                                </div>
                                <div style={{background: '#f1f5f9', padding: '22px 36px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center'}}>
                                    <div style={{flex: 1}}>
                                        <span style={{fontWeight: 'bold', color: '#2563eb', fontSize: '1.12rem'}}>Car: </span>
                                        <span style={{color: '#334155', fontSize: '1.12rem', fontWeight: '500'}}>{
                                            (review.car && ((review.car.brand || '') + ' ' + (review.car.model || ''))) ||
                                            review.carName ||
                                            'N/A'
                                        }</span>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{fontWeight: 'bold', color: '#2563eb', fontSize: '1.12rem'}}>ID: </span>
                                        <span style={{color: '#334155', fontSize: '1.12rem', fontWeight: '500'}}>{
                                            review.carID ||
                                            (review.car && (review.car.carID || review.car.id || review.car._id)) ||
                                            review.car_Id ||
                                            review.carId ||
                                            'N/A'
                                        }</span>
                                    </div>
                                </div>
                                <div style={{padding: '28px 36px', background: '#fff', borderBottomLeftRadius: '22px', borderBottomRightRadius: '22px'}}>
                                    <p style={{fontStyle: 'italic', color: '#334155', fontSize: '1.18rem', margin: 0, lineHeight: '1.7'}}>{review.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewList;