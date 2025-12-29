import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.config';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pendingListings: 0,
        unverifiedBrokers: 0,
        totalListings: 0,
        totalBrokers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = auth.currentUser;
                const token = await user.getIdToken();

                const res = await fetch('https://staynest-6vsv.onrender.com/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                setStats({
                    pendingListings: data.pendingListings,
                    unverifiedBrokers: data.unverifiedBrokers,
                    totalListings: data.totalListings,
                    totalBrokers: data.totalBrokers
                });
            } catch (err) {
                console.error("Stats fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="spinner-small" style={{ margin: '100px auto' }}></div>;

    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-brand)', margin: 0 }}>Admin Control Panel</h1>
                <p style={{ color: '#64748B', marginTop: '4px' }}>Manage listings, brokers, and platform security</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <StatCard
                    title="Pending Listings"
                    value={stats.pendingListings}
                    icon="pending_actions"
                    color="#F59E0B"
                    onClick={() => navigate('/admin/listings')}
                />
                <StatCard
                    title="Total Listings"
                    value={stats.totalListings}
                    icon="home_work"
                    color="#3B82F6"
                    onClick={() => { }}
                />
                <StatCard
                    title="Total Brokers"
                    value={stats.totalBrokers}
                    icon="people"
                    color="#10B981"
                    onClick={() => navigate('/admin/brokers')}
                />
            </div>

            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '800' }}>Property Operations</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn-primary" onClick={() => navigate('/admin/listings')} style={{ flex: 1, padding: '16px', borderRadius: '14px' }}>
                        Review Pending Listings
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'white',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}
        onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
        }}
        onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
        }}
    >
        <div style={{ background: `${color}15`, color: color, padding: '12px', borderRadius: '16px', display: 'flex' }}>
            <span className="material-icons-round" style={{ fontSize: '32px' }}>{icon}</span>
        </div>
        <div>
            <span style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#64748B' }}>{title}</span>
            <span style={{ fontSize: '28px', fontWeight: '900', color: '#1E293B' }}>{value}</span>
        </div>
    </div>
);

export default AdminDashboard;
