import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';
import { useNavigate } from 'react-router-dom';
import { fetchListings } from '../../../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    const [activeFilters, setActiveFilters] = useState({
        maxPrice: 2000,
        campuses: [],
        billsIncluded: false
    });

    // Campus Coordinates (Center Points)
    const CAMPUS_LOCATIONS = {
        'Trinity College': { lat: 53.3438, lng: -6.2546 },
        'UCD': { lat: 53.3076, lng: -6.2225 },
        'DCU': { lat: 53.3855, lng: -6.2568 },
        'UCC': { lat: 51.8921, lng: -8.4929 },
        'TU Dublin': { lat: 53.3547, lng: -6.2795 },
        'University of Galway': { lat: 53.2796, lng: -9.0627 },
        'DBS (Dublin Business School)': { lat: 53.3392, lng: -6.2647 },
        'Griffith College': { lat: 53.3308, lng: -6.2797 },
        'NCI (National College of Ireland)': { lat: 53.3490, lng: -6.2427 },
        'RCSI': { lat: 53.3394, lng: -6.2618 },
        'IADT': { lat: 53.2861, lng: -6.1539 }
    };

    // Haversine Formula for Distance (km)
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchListings();
            // Ensure lat/lng exist (fallback if missing)
            const safeData = data.map(item => ({
                ...item,
                lat: item.lat || 53.3498 + (Math.random() * 0.04 - 0.02),
                lng: item.lng || -6.2603 + (Math.random() * 0.04 - 0.02)
            }));
            setListings(safeData);
            setFilteredListings(safeData);
        };
        loadData();
    }, []);

    // Re-run filter when activeFilters or listings change
    useEffect(() => {
        let result = listings;

        // 1. Price Filter
        result = result.filter(item => item.price <= activeFilters.maxPrice);

        // 2. Bills Included Filter
        if (activeFilters.billsIncluded) {
            result = result.filter(item => item.tags && item.tags.includes('bills'));
        }

        // 3. Multi-Campus Filter (Geospatial & Text Fallback)
        if (activeFilters.campuses && activeFilters.campuses.length > 0) {
            result = result.filter(item => {
                // If the user selected campuses, check if listing is near ANY of them
                return activeFilters.campuses.some(campus => {
                    const campusCoords = CAMPUS_LOCATIONS[campus];
                    if (campusCoords && item.lat && item.lng) {
                        const dist = getDistance(campusCoords.lat, campusCoords.lng, item.lat, item.lng);
                        return dist <= 5; // Within 5km
                    }
                    // Fallback to text matching if coords fail
                    const text = (item.title + ' ' + item.location).toLowerCase();
                    return text.includes(campus.toLowerCase());
                });
            });
        }

        setFilteredListings(result);
    }, [activeFilters, listings]);

    return (
        <div style={{ padding: '24px 16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <img src="/logo.png" alt="StayNest" style={{ height: '32px', display: 'none' }} />
                {/* Fallback Title if no logo */}
                <h1 style={{ fontSize: '22px', margin: 0, color: '#FF5A5F', fontWeight: '800', letterSpacing: '-0.5px' }}>StayNest</h1>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                        <span className="material-icons-round" style={{ fontSize: '24px', color: '#222' }}>person</span>
                    </button>
                    <button
                        style={{
                            background: '#222',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                        onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                    >
                        <span className="material-icons-round" style={{ fontSize: '20px', color: 'white' }}>
                            {viewMode === 'list' ? 'map' : 'list'}
                        </span>
                    </button>
                </div>
            </div>

            <SearchFilters onFilterChange={(newFilters) => setActiveFilters(prev => ({ ...prev, ...newFilters }))} />

            {viewMode === 'list' ? (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>
                        {filteredListings.length > 0 ? 'Recommended for you' : 'No homes found'}
                    </h3>
                    {filteredListings.map(item => (
                        <div key={item.id} onClick={() => navigate(`/property/${item.id}`)} style={{ cursor: 'pointer' }}>
                            <ListingCard listing={item} />
                        </div>
                    ))}
                </div>
            ) : (
                <MapView listings={filteredListings} />
            )}
        </div>
    );
};

export default Dashboard;
