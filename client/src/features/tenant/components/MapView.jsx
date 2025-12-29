import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';

// Replace with your actual token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWlzd2FyeWFrcyIsImEiOiJjbWpxZWhkeTgxb3NtM2RzZGU2dHgwdWxsIn0.kajAFDnDl90UDZ_yxGZzog';
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapView = ({ listings = [], center }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);
    const navigate = useNavigate();
    const [mapLoaded, setMapLoaded] = useState(false);

    // Use listings directly from props (already filtered by parent)
    const filteredListings = listings;

    // 2. Initialize map (Only once)
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: center ? [center.lng, center.lat] : [-6.2603, 53.3498],
            zoom: 12,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
            setMapLoaded(true);
            map.current.resize(); // Fixes blank map issues on first load
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // 3. Update center when searched or moved
    useEffect(() => {
        if (!map.current || !center) return;
        map.current.flyTo({
            center: [center.lng, center.lat],
            zoom: 14,
            duration: 1500
        });
    }, [center]);

    // 4. Update Markers (Handles Filtering & Detail Popups)
    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        // Clear old markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        filteredListings.forEach(listing => {
            // Create Custom Pin Element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cssText = `
                background: #2563EB;
                width: 38px;
                height: 38px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const priceText = document.createElement('span');
            priceText.style.cssText = `transform: rotate(45deg); color: white; font-weight: bold; font-size: 10px;`;
            priceText.textContent = `€${listing.price}`;
            el.appendChild(priceText);

            // Detailed Popup HTML
            const popupHTML = `
                <div style="width: 220px; font-family: sans-serif;">
                    <img src="${listing.images?.[0] || listing.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;" />
                    <h3 style="margin: 10px 0 5px; font-size: 14px;">${listing.title}</h3>
                    <p style="margin: 0; color: #666; font-size: 12px;">€${listing.price}/month</p>
                    <button id="btn-${listing.id}" style="margin-top: 10px; width: 100%; background: #2563EB; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer;">
                        View House Details
                    </button>
                </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
                .setHTML(popupHTML);

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([listing.lng, listing.lat])
                .setPopup(popup)
                .addTo(map.current);

            // Handle button click inside popup
            popup.on('open', () => {
                document.getElementById(`btn-${listing.id}`).onclick = () => {
                    navigate(`/property/${listing.id}`);
                };
            });

            markers.current.push(marker);
        });

        // Fit map to show all filtered results
        if (filteredListings.length > 0 && !center) {
            const bounds = new mapboxgl.LngLatBounds();
            filteredListings.forEach(l => bounds.extend([l.lng, l.lat]));
            map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
        }

    }, [filteredListings, mapLoaded, navigate]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
            <div
                ref={mapContainer}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
            />

            {/* Budget Indicator Badge - Removed as it was confusing */}
            <div style={{
                position: 'absolute', top: '20px', left: '20px', zIndex: 1,
                background: 'white', padding: '8px 12px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                {filteredListings.length} Properties found
            </div>
        </div>
    );
};

export default MapView;