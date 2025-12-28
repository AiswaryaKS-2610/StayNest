import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BrokerLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [totalUnread, setTotalUnread] = useState(0);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let count = 0;
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                count += (data[`unreadCount_${currentUser.uid}`] || 0);
            });
            setTotalUnread(count);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const menuItems = [
        { title: 'My Listings', icon: 'dashboard', path: '/broker/dashboard' },
        { title: 'Add Listing', icon: 'add_business', path: '/broker/new-listing' },
        { title: 'Messages', icon: 'forum', path: '/broker/messages', badge: totalUnread },
        { title: 'Verification', icon: 'verified', path: '/broker/verification' },
        { title: 'Profile', icon: 'person', path: '/broker/profile' }
    ];

    const handleLogout = () => {
        auth.signOut();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
            {/* Sidebar */}
            <div style={{
                width: '260px',
                background: 'white',
                borderRight: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--color-brand)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <span className="material-icons-round">home</span>
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-brand)', letterSpacing: '-0.5px' }}>StayNest</span>
                </div>

                <div style={{ flex: 1, padding: '0 16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px', marginBottom: '16px' }}>
                        Broker Panel
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
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    marginBottom: '4px',
                                    cursor: 'pointer',
                                    background: isActive ? 'var(--color-brand-light)' : 'transparent',
                                    color: isActive ? 'var(--color-brand)' : '#64748B',
                                    transition: 'all 0.2s ease',
                                    fontWeight: isActive ? '700' : '500'
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '20px' }}>{item.icon}</span>
                                <span style={{ fontSize: '15px' }}>{item.title}</span>
                                {item.badge > 0 && (
                                    <div style={{
                                        marginLeft: 'auto',
                                        background: '#EF4444',
                                        color: 'white',
                                        borderRadius: '10px',
                                        minWidth: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        padding: '0 6px'
                                    }}>
                                        {item.badge}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0' }}>
                    <div
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            color: '#EF4444',
                            fontWeight: '600'
                        }}
                    >
                        <span className="material-icons-round">logout</span>
                        <span>Logout</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BrokerLayout;
