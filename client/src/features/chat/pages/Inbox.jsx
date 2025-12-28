import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';

import BottomNav from '../../common/components/BottomNav';

const Inbox = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;
    const isBrokerView = location.pathname.startsWith('/broker');

    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUser.uid),
            orderBy("lastUpdateTime", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chats = snapshot.docs.map(doc => {
                const data = doc.data();
                const otherUserId = data.participants.find(p => p !== currentUser.uid) || 'admin';
                return {
                    id: doc.id,
                    otherUserId,
                    ...data
                };
            });

            // Fetch names for all other users
            const names = { ...userNames };
            const uniqueOtherIds = [...new Set(chats.map(c => c.otherUserId))];

            await Promise.all(uniqueOtherIds.map(async (uid) => {
                if (uid === 'admin') {
                    names[uid] = 'Support';
                } else if (!names[uid]) {
                    try {
                        const userDoc = await getDoc(doc(db, "users", uid));
                        if (userDoc.exists()) {
                            names[uid] = userDoc.data().fullName || 'User';
                        }
                    } catch (err) {
                        console.error("Error fetching user name:", err);
                    }
                }
            }));

            setUserNames(names);
            setConversations(chats);
            setLoading(false);
        }, (error) => {
            console.error("Inbox Listen Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div style={{ padding: isBrokerView ? '0' : '16px', paddingBottom: '90px', maxWidth: isBrokerView ? '100%' : '600px', margin: isBrokerView ? '0' : '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <h1 style={{ margin: 0, fontSize: isBrokerView ? '28px' : '24px', color: 'var(--color-brand)', fontWeight: '800', letterSpacing: '-0.5px' }}>Messages</h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <div className="spinner-small" style={{ margin: '0 auto' }}></div>
                </div>
            ) : conversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: '#f9f9f9', borderRadius: '20px' }}>
                    <span className="material-icons-round" style={{ fontSize: '48px', color: '#eee', marginBottom: '16px' }}>forum</span>
                    <p style={{ margin: 0, fontWeight: '600' }}>No messages yet</p>
                    <p style={{ fontSize: '13px', color: '#717171' }}>Contact brokers to start a conversation.</p>
                </div>
            ) : (
                <div>
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => navigate(isBrokerView ? `/broker/messages/${chat.otherUserId}` : `/messages/${chat.otherUserId}`)}
                            style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '16px',
                                marginBottom: '12px',
                                border: '1px solid #f0f0f0',
                                display: 'flex',
                                gap: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', background: 'var(--color-brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <span className="material-icons-round">person</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#222' }}>
                                        {userNames[chat.otherUserId] || (chat.otherUserId === 'admin' ? 'Support' : 'User')}
                                    </h4>
                                    <span style={{ fontSize: '11px', color: '#717171' }}>
                                        {chat.lastUpdateTime?.toDate().toLocaleDateString() === new Date().toLocaleDateString()
                                            ? chat.lastUpdateTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : chat.lastUpdateTime?.toDate().toLocaleDateString()
                                        }
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        {chat.propertyTitle && (
                                            <div style={{ fontSize: '11px', color: 'var(--color-brand)', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span className="material-icons-round" style={{ fontSize: '14px' }}>home</span>
                                                {chat.propertyTitle}
                                            </div>
                                        )}
                                        <p style={{
                                            margin: 0,
                                            fontSize: '13px',
                                            color: chat[`unreadCount_${currentUser.uid}`] > 0 ? '#000' : '#717171',
                                            fontWeight: chat[`unreadCount_${currentUser.uid}`] > 0 ? '700' : '400',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '220px'
                                        }}>
                                            {chat.lastMessage}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                        {chat[`unreadCount_${currentUser.uid}`] > 0 && (
                                            <div style={{
                                                background: 'var(--color-brand)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                minWidth: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                padding: '0 6px'
                                            }}>
                                                {chat[`unreadCount_${currentUser.uid}`]}
                                            </div>
                                        )}
                                        {chat.messageCount && (
                                            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>
                                                {chat.messageCount} msg
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isBrokerView && <BottomNav />}
        </div>
    );
};

export default Inbox;
