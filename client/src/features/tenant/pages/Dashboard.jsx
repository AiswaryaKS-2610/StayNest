import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';
import BottomNav from '../../common/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { fetchListings } from '../../../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeFilters, setActiveFilters] = useState({
        maxPrice: 3000,
        selectedCollege: '',
        searchPlace: '',
        billsIncluded: false
    });
    const [searchCoords, setSearchCoords] = useState(null);

    // ... (CAMPUS_LOCATIONS and getDistance remain same)
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

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
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
            const safeData = data.map(item => ({
                ...item,
                lat: parseFloat(item.lat || item.coordinates?.lat || 53.3498),
                lng: parseFloat(item.lng || item.coordinates?.lng || -6.2603)
            }));
            setListings(safeData);
            setFilteredListings(safeData);
        };
        loadData();
    }, []);

    // Geocode search place when it changes
    useEffect(() => {
        if (!activeFilters.searchPlace) {
            setSearchCoords(null);
            return;
        }

        const geocode = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(activeFilters.searchPlace + ', Dublin')}`,
                    { headers: { 'User-Agent': 'StayNest-App' } }
                );
                const data = await response.json();
                if (data && data.length > 0) {
                    setSearchCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        };

        const timer = setTimeout(geocode, 400); // Faster Debounce
        return () => clearTimeout(timer);
    }, [activeFilters.searchPlace]);

    useEffect(() => {
        let result = [...listings];

        // 1. Basic Filters
        result = result.filter(item => item.price <= activeFilters.maxPrice);

        if (activeFilters.billsIncluded) {
            result = result.filter(item => item.tags && item.tags.includes('bills'));
        }

        // 2. Proximity-based Search
        if (searchCoords) {
            const RADIUS_KM = 3; // 3km radius
            result = result.filter(item => {
                const dist = getDistance(searchCoords.lat, searchCoords.lng, item.lat, item.lng);
                return dist <= RADIUS_KM;
            });
            // Sort by proximity to searched place
            result = result.map(item => ({
                ...item,
                distanceToSearch: getDistance(searchCoords.lat, searchCoords.lng, item.lat, item.lng)
            })).sort((a, b) => a.distanceToSearch - b.distanceToSearch);
        } else if (activeFilters.searchPlace) {
            const search = activeFilters.searchPlace.toLowerCase().trim();
            result = result.filter(item => {
                const title = (item.title || '').toLowerCase();
                const location = (item.location || '').toLowerCase();
                const address = (item.address || '').toLowerCase();
                return title.includes(search) ||
                    location.includes(search) ||
                    address.includes(search);
            });
        }

        // Apply Category Filter
        if (activeCategory !== 'All') {
            result = result.filter(item => {
                const type = (item.type || 'Entire Home').toLowerCase();
                const title = (item.title || '').toLowerCase();
                if (activeCategory === 'Sharing') return type.includes('sharing') || type.includes('room') || title.includes('room');
                if (activeCategory === 'Entire Home') {
                    return type.includes('entire home') || type.includes('flat') || type.includes('apartment') || title.includes('flat') || title.includes('apartment');
                }
                return true;
            });
        }

        // 3. Proximity to College (Secondary Sorting/Annotation)
        if (activeFilters.selectedCollege) {
            const campusCoords = CAMPUS_LOCATIONS[activeFilters.selectedCollege];
            if (campusCoords) {
                result = result.map(item => {
                    const dist = getDistance(campusCoords.lat, campusCoords.lng, item.lat, item.lng);
                    return { ...item, distanceToCollege: dist };
                });

                // Only sort by college if no specific area is searched
                if (!searchCoords) {
                    result.sort((a, b) => a.distanceToCollege - b.distanceToCollege);
                }
            }
        } else {
            result = result.map(item => ({ ...item, distanceToCollege: null }));
        }

        setFilteredListings(result);
    }, [activeFilters, listings, searchCoords, activeCategory]);

    return (
        <div style={{ padding: '16px', paddingBottom: '90px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            background: 'var(--color-brand)',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '24px' }}>home</span>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--color-brand)', fontWeight: '800', letterSpacing: '-0.5px' }}>StayNest</h1>
                            <p style={{ margin: '0', color: 'var(--color-text-sec)', fontSize: '13px', fontWeight: '500' }}>Find your perfect Dublin home</p>
                        </div>
                    </div>
                    <button
                        className="glass-panel"
                        style={{ ...headerBtnStyle, border: 'none' }}
                        onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                    >
                        <span className="material-icons-round" style={{ color: 'var(--color-brand)' }}>
                            {viewMode === 'list' ? 'map' : 'list'}
                        </span>
                    </button>
                </div>
                <SearchFilters
                    initialFilters={activeFilters}
                    onFilterChange={(newFilters) => setActiveFilters(prev => ({ ...prev, ...newFilters }))}
                />
            </div>

            {/* Premium Category Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '28px',
                paddingBottom: '8px',
                borderBottom: '1px solid #F1F5F9'
            }}>
                {['All', 'Sharing', 'Entire Home'].map((cat) => (
                    <div
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            opacity: activeCategory === cat ? 1 : 0.5,
                            transition: 'var(--transition-smooth)',
                            position: 'relative',
                            paddingBottom: '8px'
                        }}
                    >
                        <span className="material-icons-round" style={{
                            fontSize: '24px',
                            color: activeCategory === cat ? 'var(--color-brand)' : 'var(--color-text-sec)'
                        }}>
                            {cat === 'All' ? 'grid_view' : cat === 'Sharing' ? 'groups' : 'home'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>{cat.toUpperCase()}</span>
                        {activeCategory === cat && (
                            <div style={{
                                position: 'absolute',
                                bottom: -1,
                                width: '100%',
                                height: '2px',
                                background: 'var(--color-brand)',
                                borderRadius: '2px'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {viewMode === 'list' ? (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '20px', margin: 0, fontWeight: '800', color: 'var(--color-text-pri)' }}>
                            {filteredListings.length > 0 ? 'Available Properties' : 'No properties found'}
                        </h3>
                        {filteredListings.length > 0 && (
                            <span style={{ fontSize: '13px', color: 'var(--color-text-sec)', fontWeight: '600' }}>
                                {filteredListings.length} results
                            </span>
                        )}
                    </div>
                    {filteredListings.map((item, index) => (
                        <div
                            key={item.id}
                            className="animate-in"
                            style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }}
                            onClick={() => navigate(`/property/${item.id}`)}
                        >
                            <ListingCard listing={item} />
                        </div>
                    ))}
                </div>
            ) : (
                <MapView listings={listings} center={searchCoords || (activeFilters.selectedCollege ? CAMPUS_LOCATIONS[activeFilters.selectedCollege] : null)} />
            )}

            <BottomNav />
        </div>
    );
};

const headerBtnStyle = {
    background: 'white',
    border: '1px solid #eee',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#222',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

export default Dashboard;
