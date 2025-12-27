import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inbox = () => {
    const navigate = useNavigate();

    // Mock Conversations
    const conversations = [
        { id: 1, name: 'Conor O\'Brien', lastMessage: 'Is the apartment still available?', time: '10:30 AM', unread: true },
        { id: 2, name: 'Sarah Murphy', lastMessage: 'When can I arrange a viewing?', time: 'Yesterday', unread: false }
    ];

    return (
        <div style={{ padding: '16px', paddingBottom: '80px' }}>
            <h1>Messages</h1>
            <div style={{ marginTop: '16px' }}>
                {conversations.map(chat => (
                    <div
                        key={chat.id}
                        onClick={() => navigate(`/messages/${chat.id}`)}
                        style={{
                            background: chat.unread ? '#ECFDF5' : 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '8px',
                            border: '1px solid #eee',
                            display: 'flex',
                            gap: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ width: '48px', height: '48px', background: '#ddd', borderRadius: '50%' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ margin: 0 }}>{chat.name}</h4>
                                <span style={{ fontSize: '12px', color: '#666' }}>{chat.time}</span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: '14px', color: chat.unread ? 'black' : '#666', fontWeight: chat.unread ? 'bold' : 'normal' }}>
                                {chat.lastMessage}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inbox;
