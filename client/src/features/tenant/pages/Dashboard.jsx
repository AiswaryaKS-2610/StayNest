import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import { auth } from '../../../firebase.config';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';
import BottomNav from '../../common/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { fetchListings } from '../../../services/api';
import RoommateCard from '../components/RoommateCard';
import { getRoommates } from '../../../services/roommateService';
import AddRoommateModal from '../components/AddRoommateModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'roommates'
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
    const [sortBy, setSortBy] = useState('recommended');
    const [quickFilters, setQuickFilters] = useState([]);
    const [searchCoords, setSearchCoords] = useState(null);

    // Roommate State
    const [dbRoommates, setDbRoommates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter out current user
    const visibleRoommates = dbRoommates.filter(p => p.userId !== auth.currentUser?.uid);

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

    const refreshRoommates = async () => {
        try {
            const data = await getRoommates();
            setDbRoommates(data);
        } catch (error) {
            console.error("Failed to load roommates", error);
        }
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
        refreshRoommates();
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
        result = result.filter(item => {
            const price = parseFloat(item.price);
            return price <= activeFilters.maxPrice;
        });

        if (activeFilters.billsIncluded) {
            result = result.filter(item => {
                const hasBills = item.tags && item.tags.includes('bills');
                const flagBills = item.billsIncluded === true;
                return hasBills || flagBills;
            });
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

        // 4. Quick Filters (Amenities)
        if (quickFilters.length > 0) {
            console.log("Applying Quick Filters...");
            result = result.filter(item => {
                // Combine 'tags' and 'amenities' arrays if both exist for backward compatibility
                const itemAmenities = [
                    ...(item.amenities || []),
                    ...(item.tags || [])
                ].map(a => a.toLowerCase().trim());

                const match = quickFilters.every(filter => {
                    // Check exact match or partial match for things like 'Gym' vs 'Gym Access'
                    return itemAmenities.some(ia => ia.includes(filter.toLowerCase()));
                });

                if (!match) {
                    // console.log(`Dropped QuickFilter: ${item.title} has ${itemAmenities}`);
                }
                return match;
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
            }
        } else {
            result = result.map(item => ({ ...item, distanceToCollege: null }));
        }

        // 5. Sorting
        switch (sortBy) {
            case 'price_low':
                result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price_high':
                result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'newest':
                result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                break;
            case 'recommended':
            default:
                // If College selected, sort by proximity
                if (activeFilters.selectedCollege) {
                    result.sort((a, b) => (a.distanceToCollege || Infinity) - (b.distanceToCollege || Infinity));
                }
                // Else if search made, sort by proximity
                else if (searchCoords) {
                    result.sort((a, b) => (a.distanceToSearch || Infinity) - (b.distanceToSearch || Infinity));
                }
                break;
        }

        setFilteredListings(result);
    }, [activeFilters, listings, searchCoords, activeCategory, sortBy, quickFilters]);

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

                {/* Main Toggle */}
                <div style={{
                    background: '#F1F5F9',
                    padding: '4px',
                    borderRadius: '16px',
                    display: 'flex',
                    marginBottom: '24px'
                }}>
                    <button
                        onClick={() => setActiveTab('properties')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '14px',
                            border: 'none',
                            background: activeTab === 'properties' ? 'white' : 'transparent',
                            color: activeTab === 'properties' ? 'var(--color-brand)' : '#64748B',
                            fontWeight: '700',
                            fontSize: '14px',
                            boxShadow: activeTab === 'properties' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Find a Home
                    </button>
                    <button
                        onClick={() => setActiveTab('roommates')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '14px',
                            border: 'none',
                            background: activeTab === 'roommates' ? 'white' : 'transparent',
                            color: activeTab === 'roommates' ? 'var(--color-brand)' : '#64748B',
                            fontWeight: '700',
                            fontSize: '14px',
                            boxShadow: activeTab === 'roommates' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Buddy Up
                    </button>
                </div>

                {/* Properties View */}
                {activeTab === 'properties' && (
                    <>
                        <SearchFilters
                            initialFilters={activeFilters}
                            onFilterChange={(newFilters) => setActiveFilters(prev => ({ ...prev, ...newFilters }))}
                        />

                        {/* Quick Filters & Sorting */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', flex: 1, scrollbarWidth: 'none' }}>
                                {['Wifi', 'Ensuite', 'Studio', 'Gym', 'Parking'].map(tag => {
                                    const active = quickFilters.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => setQuickFilters(prev => active ? prev.filter(t => t !== tag) : [...prev, tag])}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                border: `1px solid ${active ? 'var(--color-brand)' : '#E2E8F0'}`,
                                                background: active ? '#EFF6FF' : 'white',
                                                color: active ? 'var(--color-brand)' : '#64748B',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        appearance: 'none',
                                        background: 'white',
                                        border: '1px solid #E2E8F0',
                                        padding: '8px 32px 8px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: 'var(--color-text-pri)',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="newest">Newest</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                </select>
                                <span className="material-icons-round" style={{
                                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '16px', color: '#64748B', pointerEvents: 'none'
                                }}>sort</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Content Area */}
            {activeTab === 'properties' ? (
                <>
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
                                    <ListingCard
                                        listing={item}
                                        commuteTarget={activeFilters.selectedCollege ? { name: activeFilters.selectedCollege, ...CAMPUS_LOCATIONS[activeFilters.selectedCollege] } : null}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <MapView
                            listings={filteredListings}
                            center={searchCoords || (activeFilters.selectedCollege ? CAMPUS_LOCATIONS[activeFilters.selectedCollege] : null)}
                            selectedCollege={activeFilters.selectedCollege}
                        />
                    )}
                </>
            ) : (
                // Roommates View
                <div className="animate-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '20px', margin: 0, fontWeight: '800', color: 'var(--color-text-pri)' }}>
                            Suggested Roommates
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {visibleRoommates.length > 0 && (
                                <span style={{ fontSize: '13px', color: 'var(--color-text-sec)', fontWeight: '600' }}>
                                    {visibleRoommates.length} found
                                </span>
                            )}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                style={{
                                    background: 'var(--color-brand)',
                                    color: 'white',
                                    border: 'none',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)'
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '18px' }}>add</span>
                            </button>
                        </div>
                    </div>

                    {visibleRoommates.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-hint)' }}>
                            <span className="material-icons-round" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>groups</span>
                            <p>No other profiles yet. Be the first to join!</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary"
                                style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '20px', fontSize: '13px' }}
                            >
                                Create Profile
                            </button>
                        </div>
                    ) : (
                        visibleRoommates.map((profile, index) => (
                            <div key={profile.id} className="animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <RoommateCard profile={profile} />
                            </div>
                        ))
                    )}
                </div>
            )}

            <AddRoommateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProfileAdded={refreshRoommates}
            />

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
