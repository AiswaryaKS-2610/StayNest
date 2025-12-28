import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Component to handle map center updates
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 14, {
                duration: 1.5
            });
        }
    }, [center, map]);
    return null;
}

// Custom Premium Icons
const propertyIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="
        background: var(--color-brand);
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        border: 2px solid white;
    ">
        <span class="material-icons-round" style="color: white; transform: rotate(45deg); font-size: 18px;">home</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
});

const collegeIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="
        background: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        border: 2px solid var(--color-brand);
    ">
        <span class="material-icons-round" style="color: var(--color-brand); font-size: 22px;">school</span>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const CAMPUS_LOCATIONS = {
    'Trinity College': { lat: 53.3438, lng: -6.2546 },
    'UCD': { lat: 53.3076, lng: -6.2225 },
    'DCU': { lat: 53.3855, lng: -6.2568 },
    'UCC': { lat: 51.8921, lng: -8.4929 },
    'TU Dublin': { lat: 53.3547, lng: -6.2795 },
    'University of Galway': { lat: 53.2796, lng: -9.0627 },
    'DBS': { lat: 53.3392, lng: -6.2647 },
    'Griffith College': { lat: 53.3308, lng: -6.2797 },
    'NCI': { lat: 53.3490, lng: -6.2427 },
    'RCSI': { lat: 53.3394, lng: -6.2618 },
    'IADT': { lat: 53.2861, lng: -6.1539 }
};

const MapView = ({ listings, center }) => {
    const navigate = useNavigate();
    const dublinPosition = [53.3498, -6.2603]; // Dublin City Center
    const [mapInstance, setMapInstance] = useState(null);

    const handleLocateMe = () => {
        if (!mapInstance) return;

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                mapInstance.flyTo([latitude, longitude], 15);
            },
            (err) => {
                console.error("Geolocation error:", err);
                alert("Could not get your location. Please ensure GPS is on.");
            },
            options
        );
    };

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 180px)', width: '100%', borderRadius: '24px', overflow: 'hidden', marginTop: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>

            {/* Control Overlays */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <button
                    onClick={handleLocateMe}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-brand)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span className="material-icons-round">my_location</span>
                </button>
            </div>

            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                padding: '10px 16px',
                borderRadius: '14px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.4)',
                pointerEvents: 'none'
            }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--color-brand)', borderRadius: '50%' }}></span>
                    {listings.length} Results Found
                </div>
            </div>

            <MapContainer
                center={center ? [center.lat, center.lng] : dublinPosition}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                ref={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <ZoomControl position="bottomright" />

                {center && <ChangeView center={center} />}

                {/* College Markers */}
                {Object.entries(CAMPUS_LOCATIONS).map(([name, coords]) => (
                    <Marker
                        key={name}
                        position={[coords.lat, coords.lng]}
                        icon={collegeIcon}
                    >
                        <Tooltip permanent direction="top" offset={[0, -20]} opacity={1}>
                            <div style={{
                                fontWeight: '800',
                                color: 'var(--color-brand)',
                                fontSize: '10px',
                                background: 'white',
                                padding: '2px 8px',
                                borderRadius: '20px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                border: '1px solid var(--color-brand-light)'
                            }}>{name}</div>
                        </Tooltip>
                    </Marker>
                ))}

                {/* Property Markers */}
                {listings.map(item => (
                    <Marker
                        key={item.id}
                        position={[item.lat, item.lng]}
                        icon={propertyIcon}
                    >
                        <Popup className="glass-popup">
                            <div
                                style={{
                                    minWidth: '220px',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    padding: '0'
                                }}
                                onClick={() => navigate(`/property/${item.id}`)}
                            >
                                <div style={{ position: 'relative', height: '120px' }}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        left: '8px',
                                        background: 'var(--color-brand)',
                                        color: 'white',
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '800',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        €{item.price}
                                    </div>
                                </div>
                                <div style={{ padding: '12px' }}>
                                    <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: '#1E293B' }}>{item.title}</h4>
                                    <div style={{ display: 'flex', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span className="material-icons-round" style={{ fontSize: '14px' }}>bed</span>
                                            {item.bedrooms}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span className="material-icons-round" style={{ fontSize: '14px' }}>people</span>
                                            {item.guests}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style>{`
                .leaflet-popup-content-wrapper {
                    border-radius: 20px !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255,255,255,0.4) !important;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                    width: auto !important;
                }
                .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.9) !important;
                    backdrop-filter: blur(12px) !important;
                }
                .leaflet-marker-icon {
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .leaflet-marker-icon:hover {
                    transform: scale(1.2) translateY(-5px) rotate(-45deg) !important;
                    z-index: 1000 !important;
                }
                .custom-div-icon:hover {
                    transform: scale(1.1) !important;
                }
            `}</style>
        </div>
    );
};

export default MapView;
