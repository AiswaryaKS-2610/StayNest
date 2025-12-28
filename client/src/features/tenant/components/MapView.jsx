import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, ZoomControl, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// --- CONFIGURATION ---
const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

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

// --- CUSTOM ICONS ---
const propertyIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background: #2563EB; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); border: 2px solid white;">
        <span class="material-icons-round" style="color: white; transform: rotate(45deg); font-size: 20px;">home</span>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42]
});

const collegeIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 2px solid #2563EB;">
        <span class="material-icons-round" style="color: #2563EB; font-size: 16px;">school</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

// Helper component to fly to location
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 14, {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, map]);
    return null;
};

const LocationButton = () => {
    const map = useMap();

    const handleLocate = () => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, 14);
            L.circle(e.latlng, { radius: 100 }).addTo(map);
        });
    };

    return (
        <button
            onClick={handleLocate}
            style={{
                position: 'absolute', bottom: '100px', right: '10px', zIndex: 999,
                background: 'white', border: 'none', borderRadius: '8px',
                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer'
            }}
            title="Locate Me"
        >
            <span className="material-icons-round" style={{ color: '#666', fontSize: '20px' }}>my_location</span>
        </button>
    );
};

const MapView = ({ listings, center, selectedCollege }) => {
    const navigate = useNavigate();
    const [activeListing, setActiveListing] = useState(null);

    // Filter colleges based on selection
    const visibleColleges = useMemo(() => {
        if (!selectedCollege || selectedCollege === 'All Colleges') {
            return Object.entries(CAMPUS_LOCATIONS);
        }
        return Object.entries(CAMPUS_LOCATIONS).filter(([name]) => name === selectedCollege);
    }, [selectedCollege]);

    return (
        <div style={{ position: 'relative', height: '85vh', width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <MapContainer
                key="unique-map-id"
                center={[53.3498, -6.2603]}
                zoom={13}
                zoomControl={false}
                style={{ height: '100%', width: '100%', background: '#e5e7eb' }}
            >
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                    url={TILE_LAYER_URL}
                />

                <ZoomControl position="bottomright" />
                <LocationButton />
                <MapController center={center} />

                {/* College Markers (Filtered) */}
                {visibleColleges.map(([name, coords]) => (
                    <Marker key={name} position={[coords.lat, coords.lng]} icon={collegeIcon}>
                        <Tooltip direction="top" offset={[0, -15]} opacity={1}>
                            <b style={{ color: '#2563EB' }}>{name}</b>
                        </Tooltip>
                    </Marker>
                ))}

                {listings.map(item => (
                    <Marker
                        key={item.id}
                        position={[item.lat, item.lng]}
                        icon={propertyIcon}
                        eventHandlers={{
                            click: () => setActiveListing(item),
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1} className="custom-tooltip">
                            <div style={{ padding: '4px 8px', fontWeight: '600', color: '#1e293b' }}>
                                {item.title}
                                <div style={{ color: '#2563EB', fontSize: '12px' }}>€{item.price}/mo</div>
                            </div>
                        </Tooltip>

                        <Popup className="premium-popup" minWidth={280} maxWidth={280} closeButton={false}>
                            <div onClick={() => navigate(`/property/${item.id}`)} style={{ cursor: 'pointer' }}>
                                <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: '12px', left: '12px',
                                        background: 'rgba(0,0,0,0.75)', color: 'white',
                                        padding: '4px 12px', borderRadius: '8px',
                                        fontSize: '15px', fontWeight: '700', backdropFilter: 'blur(4px)'
                                    }}>
                                        €{item.price}/mo
                                    </div>
                                </div>

                                <div style={{ padding: '16px', background: 'white' }}>
                                    <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                                        {item.title}
                                    </h3>

                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span className="material-icons-round" style={{ fontSize: '16px' }}>bed</span>
                                            {item.bedrooms} Beds
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span className="material-icons-round" style={{ fontSize: '16px' }}>person</span>
                                            {item.guests} Guests
                                        </div>
                                    </div>

                                    <button style={{
                                        width: '100%', padding: '12px',
                                        background: '#2563EB', color: 'white', border: 'none',
                                        borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                    }}>
                                        View Property
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* STYLES */}
            <style>{`
                .premium-popup .leaflet-popup-content-wrapper {
                    padding: 0 !important;
                    border-radius: 18px !important;
                    overflow: hidden !important;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.25) !important;
                }
                .premium-popup .leaflet-popup-content {
                    margin: 0 !important;
                    width: 280px !important;
                }
                .premium-popup .leaflet-popup-tip {
                    background: white;
                }
                .custom-div-icon {
                    transition: transform 0.2s ease-out;
                }
                .custom-div-icon:hover {
                    transform: scale(1.1) rotate(-45deg) translateY(-5px) !important;
                    z-index: 9999 !important;
                }
                .custom-tooltip {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                    border-radius: 8px !important;
                    padding: 0 !important;
                    overflow: hidden;
                }
                .custom-tooltip:before {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default MapView;