import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase.config';

const AdminListingReview = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const res = await fetch('https://staynest-6vsv.onrender.com/api/admin/listings/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setListings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const res = await fetch(`https://staynest-6vsv.onrender.com/api/admin/listings/${id}/${action}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setListings(listings.filter(l => l.id !== id));
                alert(`Listing ${action}ed!`);
            }
        } catch (err) {
            alert("Action failed");
        }
    };

    if (loading) return <div className="spinner-small" style={{ margin: '100px auto' }}></div>;

    return (
        <div>
            <style>{`
                @media (max-width: 600px) {
                    .review-card { flex-direction: column !important; align-items: flex-start !important; padding: 16px !important; }
                    .review-card img { width: 100% !important; height: 200px !important; }
                    .review-actions { width: 100% !important; justify-content: space-between !important; margin-top: 12px !important; }
                }
            `}</style>

            <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '32px' }}>Review Pending Listings</h1>

            {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', background: '#F8FAFC', borderRadius: '24px' }}>
                    <span className="material-icons-round" style={{ fontSize: '48px', color: '#CBD5E1' }}>done_all</span>
                    <p style={{ color: '#64748B', marginTop: '16px' }}>All caught up! No pending listings.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {listings.map(listing => (
                        <div key={listing.id} className="review-card" style={{
                            background: 'white',
                            padding: '24px',
                            borderRadius: '24px',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            gap: '24px',
                            alignItems: 'center'
                        }}>
                            <img src={listing.image || listing.images?.[0]} style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} alt={listing.title} />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800' }}>{listing.title}</h4>
                                <p style={{ margin: '0 0 8px', color: '#64748B', fontSize: '14px' }}>{listing.location} | €{listing.price}/mo</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={tagStyle}>{listing.type}</span>
                                    <span style={tagStyle}>{listing.subType}</span>
                                </div>
                            </div>
                            <div className="review-actions" style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => handleAction(listing.id, 'approve')}
                                    style={{ ...actionBtnStyle, background: '#10B98115', color: '#10B981' }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(listing.id, 'reject')}
                                    style={{ ...actionBtnStyle, background: '#EF444415', color: '#EF4444' }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const tagStyle = {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    background: '#F1F5F9',
    color: '#64748B'
};

const actionBtnStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

export default AdminListingReview;
