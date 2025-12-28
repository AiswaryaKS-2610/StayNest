import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../../firebase.config';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { title: 'Dashboard', icon: 'grid_view', path: '/admin' },
        { title: 'Listing Review', icon: 'list_alt', path: '/admin/listings' },
        { title: 'Return to App', icon: 'arrow_back', path: '/tenant/dashboard' }
    ];

    const handleLogout = () => {
        auth.signOut();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
            {/* Admin Sidebar */}
            <div style={{
                width: '280px',
                background: '#1E293B', // Darker slate for admin feel
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                color: 'white'
            }}>
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #3B82F6, #1E3A8A)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                        <span className="material-icons-round">security</span>
                    </div>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>StayNest <span style={{ color: '#3B82F6' }}>Admin</span></span>
                </div>

                <div style={{ flex: 1, padding: '0 16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '0 12px', marginBottom: '24px' }}>
                        Management Console
                    </p>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    borderRadius: '14px',
                                    marginBottom: '8px',
                                    cursor: 'pointer',
                                    background: isActive ? '#3B82F6' : 'transparent',
                                    color: isActive ? 'white' : '#94A3B8',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: isActive ? '700' : '600'
                                }}
                                onMouseOver={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseOut={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#94A3B8';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '22px' }}>{item.icon}</span>
                                <span style={{ fontSize: '15px' }}>{item.title}</span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            color: '#F87171',
                            fontWeight: '700',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span className="material-icons-round">logout</span>
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>

            {/* Admin Content Area */}
            <div style={{ flex: 1, marginLeft: '280px' }}>
                <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
