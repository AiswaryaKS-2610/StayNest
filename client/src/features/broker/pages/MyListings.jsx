import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchListings } from '../../../services/api';
import ListingCard from '../../tenant/components/ListingCard';
import { auth } from '../../../firebase.config';

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMyListings = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;
                const token = await user.getIdToken();
                const res = await fetch('http://localhost:5000/api/listings/broker', {
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
        loadMyListings();
    }, []);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-brand)', fontWeight: '800', letterSpacing: '-0.5px' }}>My Listings</h1>
                    <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '15px' }}>You have {listings.length} properties listed</p>
                </div>
                <button
                    className="btn-primary"
                    style={{ width: 'auto', padding: '12px 24px', borderRadius: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => navigate('/broker/new-listing')}
                >
                    <span className="material-icons-round">add</span>
                    Create New
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="spinner-small" style={{ margin: '0 auto' }}></div>
                </div>
            ) : listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
                    <div style={{
                        width: '80px', height: '80px', background: 'var(--color-brand-light)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-brand)'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '40px' }}>holiday_village</span>
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1E293B', fontWeight: '800' }}>No listings yet</h2>
                    <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px' }}>
                        Start earning by listing your first property on StayNest today.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '14px 32px', borderRadius: '16px' }}
                        onClick={() => navigate('/broker/new-listing')}
                    >
                        List your property
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {listings.map(item => (
                        <ListingCard key={item.id} listing={item} isBrokerView={true} />
                    ))}
                </div>
            )}
        </>
    );
};

export default MyListings;
