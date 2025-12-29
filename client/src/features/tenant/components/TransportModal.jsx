import React, { useState } from 'react';

const TransportModal = ({ isOpen, onClose, property, selectedCollege }) => {
    const [travelMode, setTravelMode] = useState('transit'); 

    if (!isOpen || !property || !selectedCollege) return null;

    
    const origin = `${property.lat},${property.lng}`;
    const destination = selectedCollege.name;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
    const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${travelMode}`;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="animate-in" style={{
                background: 'white',
                width: '100%',
                maxWidth: '800px',
                borderRadius: '24px',
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--color-text-pri)' }}>
                            Routes to {selectedCollege.name}
                        </h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-sec)' }}>
                            From: {property.address}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round" style={{ fontSize: '24px', color: '#64748B' }}>close</span>
                    </button>
                </div>

                {}
                <div style={{
                    padding: '16px 24px',
                    display: 'flex',
                    gap: '12px',
                    borderBottom: '1px solid #E2E8F0'
                }}>
                    {[
                        { mode: 'transit', icon: 'directions_bus', label: 'Public Transit' },
                        { mode: 'driving', icon: 'directions_car', label: 'Driving' },
                        { mode: 'walking', icon: 'directions_walk', label: 'Walking' }
                    ].map(({ mode, icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setTravelMode(mode)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '12px',
                                border: 'none',
                                background: travelMode === mode ? 'var(--color-brand)' : '#F1F5F9',
                                color: travelMode === mode ? 'white' : '#64748B',
                                fontWeight: '600',
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>{icon}</span>
                            {label}
                        </button>
                    ))}
                </div>

                {}
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    <div style={{
                        background: '#F8FAFC',
                        borderRadius: '16px',
                        padding: '32px',
                        textAlign: 'center',
                        border: '2px dashed #CBD5E1'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--color-brand)', marginBottom: '16px' }}>
                            map
                        </span>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text-pri)' }}>
                            View Full Route on Google Maps
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--color-text-sec)' }}>
                            Get detailed directions, real-time transit info, and estimated travel times
                        </p>
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                textDecoration: 'none'
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: '20px' }}>open_in_new</span>
                            Open in Google Maps
                        </a>
                    </div>

                    {}
                    <div style={{
                        marginTop: '24px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '16px'
                    }}>
                        <div style={{
                            background: '#EEF2FF',
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '24px', color: 'var(--color-brand)' }}>
                                schedule
                            </span>
                            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--color-text-sec)' }}>
                                Estimated Time
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-brand)' }}>
                                {travelMode === 'transit' ? '20-30 min' : travelMode === 'driving' ? '10-15 min' : '45-60 min'}
                            </p>
                        </div>
                        <div style={{
                            background: '#FEF3C7',
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '24px', color: '#92400E' }}>
                                straighten
                            </span>
                            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#78350F' }}>
                                Distance
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#92400E' }}>
                                {selectedCollege.distance || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportModal;
