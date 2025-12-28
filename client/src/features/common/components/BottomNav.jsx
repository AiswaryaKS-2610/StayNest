import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BottomNav = () => {
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

    const tabs = [
        { label: 'Explore', icon: 'search', path: '/tenant/dashboard' },
        { label: 'Wishlist', icon: 'favorite_border', path: '/tenant/favorites' },
        { label: 'Messages', icon: 'chat_bubble_outline', path: '/messages', badge: totalUnread },
        { label: 'Profile', icon: 'person_outline', path: '/profile' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '65px',
            background: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            {tabs.map((tab) => (
                <div
                    key={tab.label}
                    onClick={() => navigate(tab.path)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        color: isActive(tab.path) ? 'var(--color-brand)' : '#94a3b8',
                        transition: 'all 0.2s'
                    }}
                >
                    <span className="material-icons-round" style={{
                        fontSize: '24px',
                        fontWeight: isActive(tab.path) ? 'bold' : 'normal',
                        position: 'relative'
                    }}>
                        {tab.icon}
                        {tab.badge > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-8px',
                                background: '#EF4444',
                                color: 'white',
                                borderRadius: '50%',
                                minWidth: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '9px',
                                fontWeight: '900',
                                border: '1.5px solid white'
                            }}>
                                {tab.badge}
                            </div>
                        )}
                    </span>
                    <span style={{
                        fontSize: '10px',
                        fontWeight: isActive(tab.path) ? '600' : '500'
                    }}>
                        {tab.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default BottomNav;
