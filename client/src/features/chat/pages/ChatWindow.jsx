import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment
} from "firebase/firestore";

const ChatWindow = () => {
    const navigate = useNavigate();
    const { id: otherUserId } = useParams(); // URL parameter is the person we are talking to
    const location = useLocation();
    const isBrokerView = location.pathname.startsWith('/broker');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    const [chatData, setChatData] = useState(null);
    const scrollRef = useRef();

    // Context from navigation (if any)
    const propertyContext = location.state || {};

    const currentUser = auth.currentUser;

    // Chat ID is a combination of both UIDs (smaller first to be consistent)
    const getChatId = () => {
        if (!currentUser || !otherUserId) return null;
        const ids = [currentUser.uid, otherUserId].sort();
        return `${ids[0]}_${ids[1]}`;
    };

    const chatId = getChatId();

    useEffect(() => {
        if (!chatId) return;

        // 1. Fetch other user's info
        const fetchOtherUser = async () => {
            const userDoc = await getDoc(doc(db, "users", otherUserId));
            if (userDoc.exists()) {
                setOtherUser(userDoc.data());
            }
        };
        fetchOtherUser();

        // 2. Listen for chat document (to get property context)
        const chatUnsubscribe = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
            if (snapshot.exists()) {
                setChatData(snapshot.data());
            }
        });

        // 3. Listen for messages
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);

            // Reset unread count for current user when messages are loaded/seen
            if (msgs.length > 0 && currentUser) {
                updateDoc(doc(db, "chats", chatId), {
                    [`unreadCount_${currentUser.uid}`]: 0
                }).catch(err => console.error("Error resetting unread count:", err));
            }

            // Scroll to bottom
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return () => {
            unsubscribe();
            chatUnsubscribe();
        };
    }, [chatId, otherUserId, currentUser.uid]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !currentUser || !chatId) return;

        const messageText = input;
        setInput('');

        try {
            // Ensure the main chat document exists
            const chatMeta = {
                participants: [currentUser.uid, otherUserId],
                lastMessage: messageText,
                lastUpdateTime: serverTimestamp(),
                messageCount: increment(1),
                [`unreadCount_${otherUserId}`]: increment(1)
            };

            // If we have property context and it's not already set, add it
            if (propertyContext.propertyId && !chatData?.propertyId) {
                chatMeta.propertyId = propertyContext.propertyId;
                chatMeta.propertyTitle = propertyContext.propertyTitle;
            }

            await setDoc(doc(db, "chats", chatId), chatMeta, { merge: true });

            // Add the actual message
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: messageText,
                senderId: currentUser.uid,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: isBrokerView ? 'calc(100vh - 120px)' : '100vh',
            background: '#fff',
            position: isBrokerView ? 'relative' : 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            borderRadius: isBrokerView ? '24px' : '0',
            overflow: 'hidden',
            border: isBrokerView ? '1px solid #E2E8F0' : 'none',
            boxShadow: isBrokerView ? '0 4px 20px rgba(0,0,0,0.03)' : 'none'
        }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', background: 'white' }}>
                {!isBrokerView && (
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                )}
                <div style={{ width: '40px', height: '40px', background: 'var(--color-brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <span className="material-icons-round" style={{ fontSize: '24px' }}>person</span>
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-pri)' }}>{otherUser?.fullName || 'Broker'}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: '600' }}>Online</span>
                </div>
            </div>

            {/* Property Context Banner */}
            {(propertyContext.propertyTitle || chatData?.propertyTitle) && (
                <div style={{ padding: '8px 16px', background: 'var(--color-brand-light)', color: 'var(--color-brand)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="material-icons-round" style={{ fontSize: '18px' }}>info</span>
                    <span>Inquiring about: <b>{propertyContext.propertyTitle || chatData?.propertyTitle}</b></span>
                </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F7F7F7', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
                        <span className="material-icons-round" style={{ fontSize: '48px', marginBottom: '8px' }}>chat_bubble_outline</span>
                        <p>No messages yet. Say hi!</p>
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        alignSelf: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                        background: msg.senderId === currentUser.uid ? 'var(--color-brand)' : 'white',
                        color: msg.senderId === currentUser.uid ? 'white' : 'var(--color-text-pri)',
                        padding: '12px 16px',
                        borderRadius: '18px',
                        borderTopRightRadius: msg.senderId === currentUser.uid ? '4px' : '18px',
                        borderTopLeftRadius: msg.senderId === currentUser.uid ? '18px' : '4px',
                        maxWidth: '80%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        fontSize: '15px',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        border: msg.senderId === currentUser.uid ? 'none' : '1px solid #F1F5F9'
                    }}>
                        {msg.text}
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '12px', alignItems: 'center', background: 'white' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', background: '#F7F7F7', fontSize: '15px' }}
                />
                <button type="submit" disabled={!input.trim()} style={{
                    background: 'var(--color-success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    cursor: input.trim() ? 'pointer' : 'default',
                    opacity: input.trim() ? 1 : 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(34,197,94,0.2)'
                }}>
                    <span className="material-icons-round">send</span>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
