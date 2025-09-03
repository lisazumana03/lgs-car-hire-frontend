import React from 'react';

const reviews = [
    {
        id: 1,
        name: 'John Doe',
        rating: 5,
        comment: 'Excellent service! Highly recommended.',
        date: '2024-06-01',
    },
    {
        id: 2,
        name: 'Jane Smith',
        rating: 4,
        comment: 'Car was clean and staff were friendly.',
        date: '2024-05-28',
    },
    {
        id: 3,
        name: 'Michael Brown',
        rating: 3,
        comment: 'Average experience, but good value for money.',
        date: '2024-05-20',
    },
    {
        id: 4,
        name: 'Emily Clark',
        rating: 5,
        comment: 'Booking was easy and the car was in perfect condition. Will use again!',
        date: '2024-05-15',
    },
    {
        id: 5,
        name: 'Samuel Lee',
        rating: 4,
        comment: 'Great prices and quick pickup. Staff could be more attentive.',
        date: '2024-05-10',
    },
];

const ReviewList = () => (
    <div className="main-content">
        <div className="dashboard-container">
            <h1 style={{marginBottom: '30px'}}>Customer Reviews</h1>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
                {reviews.map(review => (
                    <div key={review.id} className="stat-card" style={{backgroundColor: '#3a3a3a', color: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '25px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                            <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginRight: '15px', boxShadow: '0 2px 8px rgba(0,123,255,0.2)'}}>
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <span style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#4ade80'}}>{review.name}</span>
                                <span style={{display: 'block', fontSize: '0.9rem', color: '#aaa', marginTop: '2px'}}>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <span style={{color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold'}}>{Array(review.rating).fill('★').join('')}</span>
                            <span style={{color: '#aaa', fontSize: '0.95rem', marginLeft: '8px'}}>({review.rating}/5)</span>
                        </div>
                        <p style={{fontStyle: 'italic', color: 'white', fontSize: '1rem', marginTop: '10px'}}>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ReviewList;