import React, { useState } from 'react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hi! I am the StayNest AI. Ask me about Irish rental laws, deposits, or verifying landlords!', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages([...messages, userMsg]);
        setInput('');

        // Mock AI Logic
        setTimeout(() => {
            let reply = "That's a great question! Check the RTB website for more details.";
            if (input.toLowerCase().includes('deposit')) reply = "In Ireland, deposits are usually one month's rent. Landlords must return it promptly unless there are damages.";
            if (input.toLowerCase().includes('rtb')) reply = "The RTB (Residential Tenancies Board) resolves disputes between landlords and tenants. All tenancies must be registered there.";
            if (input.toLowerCase().includes('scam')) reply = "Never transfer money via Western Union. Always view the property in person or ask for a live video tour first!";

            setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'var(--color-primary)', border: 'none',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <span className="material-icons-round" style={{ color: 'white', fontSize: '32px' }}>smart_toy</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '320px', height: '450px', background: 'white',
                    borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    <div style={{ padding: '16px', background: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons-round">smart_toy</span>
                            <span style={{ fontWeight: 'bold' }}>StayNest AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
                    </div>

                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F9FAFB' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    background: msg.sender === 'user' ? '#10B981' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#333',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    maxWidth: '80%',
                                    fontSize: '14px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    border: msg.sender === 'bot' ? '1px solid #eee' : 'none'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about deposits..."
                            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                        />
                        <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--color-primary)' }}>
                            <span className="material-icons-round">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
