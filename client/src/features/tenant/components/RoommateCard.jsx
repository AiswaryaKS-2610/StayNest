import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.config';

const RoommateCard = ({ profile }) => {
    const navigate = useNavigate();
    const isOwnProfile = profile.userId === auth.currentUser?.uid;

    const handleMessage = () => {
        if (isOwnProfile) return;
        // Navigate to chat (Fixing route to match App.jsx)
        navigate(`/messages/${profile.userId}`, {
            state: {
                propertyTitle: 'Buddy Up Request'
            }
        });
    };

    return (
        <div className="premium-card" style={{
            marginBottom: '16px',
            background: 'white',
            borderRadius: '24px',
            border: '2px solid transparent', // Ready for hover border
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.15)'; // Violet shadow glow
                e.currentTarget.style.borderColor = '#E9D5FF';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'transparent';
            }}
        >
            {/* Decorative Top Accent */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #22c55e, #C084FC)'
            }} />

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', marginTop: '8px' }}>
                <div style={{ position: 'relative' }}>
                    <img
                        src={profile.image || 'https://via.placeholder.com/100'}
                        alt={profile.name}
                        style={{
                            width: '88px',
                            height: '88px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        right: '6px',
                        width: '16px',
                        height: '16px',
                        background: '#10B981',
                        borderRadius: '50%',
                        border: '3px solid white'
                    }} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>
                            {profile.name}, {profile.age}
                        </h3>
                        {/* Budget Badge */}
                        <span style={{
                            fontSize: '14px',
                            background: '#F0FDF4',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontWeight: '700',
                            color: '#15803D',
                            border: '1px solid #BBF7D0'
                        }}>
                            €{profile.budget}
                        </span>
                    </div>

                    <p style={{ margin: '4px 0 12px 0', fontSize: '14px', color: '#64748B' }}>
                        Looking in: <span style={{ fontWeight: '700', color: '#22c55e' }}>{profile.location}</span>
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {profile.languagePreference && (
                            <span style={{ fontSize: '12px', background: '#F3E8FF', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', color: '#22c55e' }}>
                                🗣️ {profile.languagePreference}
                            </span>
                        )}
                        {profile.placePreference && (
                            <span style={{ fontSize: '12px', background: '#FEF3C7', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', color: '#B45309' }}>
                                📍 {profile.placePreference}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {profile.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: '11px',
                        background: 'white',
                        border: '1px solid #E2E8F0',
                        color: '#475569',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Bio with quotes */}
            <div style={{ position: 'relative', background: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                <span className="material-icons-round" style={{
                    position: 'absolute', top: -8, left: 16, background: '#22c55e', color: 'white',
                    fontSize: '16px', borderRadius: '50%', padding: '4px'
                }}>format_quote</span>
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#475569',
                    fontStyle: 'italic',
                    paddingLeft: '6px'
                }}>
                    "{profile.bio}"
                </p>
            </div>

            {!isOwnProfile && (
                <button
                    onClick={handleMessage}
                    className="btn-purple-glow"
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '16px',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span className="material-icons-round">chat</span>
                    Message {profile.name.split(' ')[0]}
                </button>
            )}
        </div>
    );
};

export default RoommateCard;
