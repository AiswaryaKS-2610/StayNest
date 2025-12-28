import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import BottomNav from '../../common/components/BottomNav';

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
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '80px' }}>
            {/* Header for Branding */}
            <div style={{
                padding: '16px 24px',
                background: 'white',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--color-brand)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '18px' }}>home</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-brand)', letterSpacing: '-0.5px' }}>StayNest</span>
                <div style={{ marginLeft: 'auto' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Broker Panel</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="broker-content" style={{ padding: '24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </div>

            {/* Bottom Nav */}
            <BottomNav />
        </div>
    );
};

export default BrokerLayout;
