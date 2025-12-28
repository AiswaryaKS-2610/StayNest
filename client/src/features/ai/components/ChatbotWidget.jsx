import React, { useState } from 'react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hi! I am the StayNest AI. Ask me about Irish rental laws, neighborhoods, or sightseeing in Dublin!', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const getLocationTips = (text) => {
        const query = text.toLowerCase();

        // Neighborhood Tips
        if (query.includes('dublin 2') || query.includes('d2') || query.includes('stephen\'s green')) {
            return "Dublin 2 is the heartbeat of the city! You must visit St. Stephen's Green, the Creative Quarter, and the National Museum. It's a premium area for students.";
        }
        if (query.includes('dublin 1') || query.includes('d1') || query.includes('smithfield')) {
            return "Dublin 1 & Smithfield have a great mix of old and new. Check out the Jameson Distillery, the Lighthouse Cinema, and the spire on O'Connell Street!";
        }
        if (query.includes('dublin 4') || query.includes('d4') || query.includes('ballsbridge')) {
            return "Dublin 4 is one of the most prestigious areas. Don't miss Herbert Park and the RDS. It's very safe and green, perfect for quiet study.";
        }
        if (query.includes('temple bar')) {
            return "Temple Bar is famous for its culture and nightlife, but it can be noisy! Great for weekend sightseeing and street art, though.";
        }

        // College Lifestyle Tips
        if (query.includes('trinity') || query.includes('tcd')) {
            return "Trinity College students love the Pav for hanging out and the Long Room library for inspiration. You're right in the city center!";
        }
        if (query.includes('ucd') || query.includes('belfield')) {
            return "UCD's Belfield campus is massive. Pro tip: The lakeside walk is great for clearing your head after lectures. Most students live in D4 or D6.";
        }
        if (query.includes('dcu') || query.includes('glasnevin')) {
            return "DCU students should explore the Botanic Gardens nearby. Glasnevin is a friendly residential area with great bus links to the city center.";
        }
        if (query.includes('tud') || query.includes('grangegorman')) {
            return "TU Dublin's Grangegorman campus is brand new! The area is becoming a major student hub with cool cafes and easy Luas access.";
        }

        // Standard Rental Laws
        if (query.includes('deposit')) return "In Ireland, deposits are usually one month's rent. Landlords must return it promptly unless there are damages.";
        if (query.includes('rtb')) return "The RTB (Residential Tenancies Board) handles dispute resolution and tenancy registration. It's your main protection as a tenant.";

        return "That's a great question! I specialize in Dublin neighborhoods and rental laws. Try asking about 'Dublin 2' or 'Trinity College' for some tips!";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages([...messages, userMsg]);
        const currentInput = input;
        setInput('');

        setTimeout(() => {
            const reply = getLocationTips(currentInput);
            setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            <style>
                {`
                    @keyframes chatPulse {
                        0% { transform: scale(1); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
                        50% { transform: scale(1.05); box-shadow: 0 8px 24px rgba(34, 197, 94, 0.5); }
                        100% { transform: scale(1); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
                    }
                `}
            </style>

            {/* Toggle Button with Visibility Fix */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'var(--color-cta)', // Bright Green
                        border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        animation: 'chatPulse 3s infinite ease-in-out',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '32px' }}>smart_toy</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '360px', height: '500px', background: 'white',
                    borderRadius: '24px', boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid #E2E8F0'
                }}>
                    <div style={{ padding: '20px', background: 'var(--color-brand)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '10px' }}>
                                <span className="material-icons-round" style={{ fontSize: '20px' }}>smart_toy</span>
                            </div>
                            <span style={{ fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>StayNest Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>close</span>
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#F8FAFC' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '16px'
                            }}>
                                <div style={{
                                    background: msg.sender === 'user' ? 'var(--color-cta)' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#1E293B',
                                    padding: '12px 16px',
                                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    maxWidth: '85%',
                                    fontSize: '14.5px',
                                    lineHeight: '1.5',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    border: msg.sender === 'bot' ? '1px solid #E2E8F0' : 'none',
                                    fontWeight: msg.sender === 'user' ? '600' : '500'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '10px', background: 'white' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Aiswarya adn Sneha is here to help you with your queries regarding Dublin sightseeing or neighborhoods..."
                            style={{
                                flex: 1, padding: '12px 18px', borderRadius: '25px',
                                border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none',
                                background: '#F1F5F9'
                            }}
                        />
                        <button type="submit" style={{
                            background: 'var(--color-brand)', color: 'white',
                            border: 'none', width: '42px', height: '42px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer'
                        }}>
                            <span className="material-icons-round">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
