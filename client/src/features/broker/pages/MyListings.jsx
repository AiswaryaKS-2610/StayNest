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
                console.error("Error loading listings:", err);
                // If it's a fetch error or auth error, show it
                if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
                    alert("Sync Error: Your client and server might be connected to different Firebase projects. Check console for details.");
                }
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

            {/* Premium Stats Row */}
            {!loading && listings.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <StatCard
                        title="Total Properties"
                        value={listings.length}
                        icon="apartment"
                        color="var(--color-brand)"
                    />
                    <StatCard
                        title="Active Listings"
                        value={listings.length}
                        icon="check_circle"
                        color="var(--color-success)"
                    />
                    <StatCard
                        title="Total Views"
                        value={listings.reduce((acc, curr) => acc + (curr.views || 0), 0)}
                        icon="visibility"
                        color="#F59E0B"
                    />
                </div>
            )}

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

const StatCard = ({ title, value, icon, color }) => (
    <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${color}15`, // 10% opacity
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
        }}>
            <span className="material-icons-round" style={{ fontSize: '24px' }}>{icon}</span>
        </div>
        <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-pri)' }}>{value}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-sec)' }}>{title}</div>
        </div>
    </div>
);

export default MyListings;
