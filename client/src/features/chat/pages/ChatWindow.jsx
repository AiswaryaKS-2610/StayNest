import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ChatWindow = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hi, I am interested in this property.', sender: 'me' },
        { id: 2, text: 'Hello! Yes, it is available for viewing on Thursday.', sender: 'them' }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sender: 'me' }]);
        setInput('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fff' }}>
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div style={{ width: '36px', height: '36px', background: '#ddd', borderRadius: '50%' }}></div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Conor O'Brien</h3>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F9FAFB' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            background: msg.sender === 'me' ? 'var(--color-primary)' : 'white',
                            color: msg.sender === 'me' ? 'white' : 'black',
                            padding: '10px 16px',
                            borderRadius: '16px',
                            maxWidth: '70%',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '12px', borderRadius: '24px', border: '1px solid #ddd', outline: 'none' }}
                />
                <button type="submit" className="btn-primary" style={{ width: 'auto', borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
                    <span className="material-icons-round">send</span>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
