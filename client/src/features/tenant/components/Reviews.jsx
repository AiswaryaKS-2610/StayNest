import React from 'react';

const Reviews = () => {
    // Mock Review Data
    const reviews = [
        { id: 1, user: 'Alice M.', rating: 5, comment: 'Amazing place! The landlord is very responsive.', date: 'Oct 2025' },
        { id: 2, user: 'John D.', rating: 4, comment: 'Great location, but the wifi can be spotty sometimes.', date: 'Sep 2025' }
    ];

    return (
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Reviews (2)</h3>

            {reviews.map(review => (
                <div key={review.id} style={{ marginBottom: '16px', background: '#F9FAFB', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{review.user}</span>
                        <span style={{ fontSize: '12px', color: '#888' }}>{review.date}</span>
                    </div>
                    <div style={{ color: '#F59E0B', fontSize: '14px', marginBottom: '4px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{review.comment}</p>
                </div>
            ))}

            <button style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', color: '#666' }}>
                Write a Review
            </button>
        </div>
    );
};

export default Reviews;
