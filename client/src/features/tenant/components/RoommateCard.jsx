import React from 'react';

const RoommateCard = ({ profile }) => {
    return (
        <div className="premium-card" style={{
            marginBottom: '16px',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <img
                        src={profile.image || 'https://via.placeholder.com/100'}
                        alt={profile.name}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #F8FAFC'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        width: '12px',
                        height: '12px',
                        background: '#10B981',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }} />
                </div>
                <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: 'var(--color-text-pri)' }}>
                        {profile.name}, {profile.age}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--color-text-sec)' }}>
                        Looking in: <span style={{ fontWeight: '600', color: 'var(--color-brand)' }}>{profile.location}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontWeight: '600', color: '#475569' }}>
                            Budget: <span style={{ color: 'var(--color-success)' }}>€{profile.budget}</span>
                        </span>
                        {profile.languagePreference && (
                            <span style={{ fontSize: '12px', background: '#EEF2FF', padding: '4px 8px', borderRadius: '6px', fontWeight: '600', color: 'var(--color-brand)' }}>
                                🗣️ {profile.languagePreference}
                            </span>
                        )}
                        {profile.placePreference && (
                            <span style={{ fontSize: '12px', background: '#FEF3C7', padding: '4px 8px', borderRadius: '6px', fontWeight: '600', color: '#92400E' }}>
                                📍 {profile.placePreference}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {profile.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: '11px',
                        background: '#EEF2FF',
                        color: 'var(--color-brand)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Bio */}
            <p style={{
                margin: '0 0 20px 0',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#64748B',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {profile.bio}
            </p>

            <button className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>
                Message {profile.name.split(' ')[0]}
            </button>
        </div>
    );
};

export default RoommateCard;
