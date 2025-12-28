import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../../firebase.config';
import BottomNav from '../../common/components/BottomNav';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { title: 'Dashboard', icon: 'grid_view', path: '/admin' },
        { title: 'Listing Review', icon: 'list_alt', path: '/admin/listings' },
        { title: 'Broker Verifications', icon: 'verified_user', path: '/admin/verifications' },
        { title: 'Return to App', icon: 'arrow_back', path: '/tenant/dashboard' }
    ];

    const handleLogout = () => {
        auth.signOut();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '80px' }}>
            {/* Admin Header */}
            <div style={{
                padding: '16px 24px',
                background: '#1E293B',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #3B82F6, #1E3A8A)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '18px' }}>security</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>StayNest <span style={{ color: '#3B82F6' }}>Admin</span></span>
                <div style={{ marginLeft: 'auto' }}>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'transparent', border: 'none', color: '#F87171', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '18px' }}>logout</span>
                        <span style={{ fontSize: '12px' }}>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Admin Navigation Menu */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid #E2E8F0',
                padding: '16px 24px',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                position: 'sticky',
                top: '64px',
                zIndex: 99
            }}>
                {menuItems.map(item => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: location.pathname === item.path ? 'var(--color-brand)' : '#F1F5F9',
                            color: location.pathname === item.path ? 'white' : '#64748B',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '18px' }}>
                            {item.icon}
                        </span>
                        {item.title}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="admin-content" style={{ padding: '24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </div>

            {/* Bottom Nav */}
            <BottomNav />
        </div>
    );
};

export default AdminLayout;
