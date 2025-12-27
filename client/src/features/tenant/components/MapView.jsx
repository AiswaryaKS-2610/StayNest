import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const MapView = ({ listings }) => {
    const navigate = useNavigate();
    const dublinPosition = [53.3498, -6.2603]; // Dublin City Center

    return (
        <div style={{ height: 'calc(100vh - 180px)', width: '100%', borderRadius: '12px', overflow: 'hidden', marginTop: '16px' }}>
            <MapContainer center={dublinPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {listings.map(item => (
                    // Randomize position slightly for demo if coords missing
                    <Marker
                        key={item.id}
                        position={[53.3498 + (Math.random() * 0.04 - 0.02), -6.2603 + (Math.random() * 0.04 - 0.02)]}
                    >
                        <Popup>
                            <div style={{ minWidth: '150px' }} onClick={() => navigate(`/property/${item.id}`)}>
                                <img src={item.image} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                <h4 style={{ margin: '8px 0 4px', fontSize: '14px' }}>{item.title}</h4>
                                <span style={{ fontWeight: 'bold', color: '#10B981' }}>€{item.price}/mo</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
