import React, { useState, useEffect } from 'react';

const SearchFilters = ({ onFilterChange, initialFilters }) => {
    const [filters, setFilters] = useState(initialFilters || {
        maxPrice: 3000,
        selectedCollege: '',
        searchPlace: '',
        billsIncluded: false,
    });

    // Sync if initialFilters change (e.g. from parent defaults)
    useEffect(() => {
        if (initialFilters) setFilters(initialFilters);
    }, [initialFilters]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const universities = [
        'Trinity College',
        'UCD',
        'DCU',
        'UCC',
        'TU Dublin',
        'University of Galway',
        'DBS (Dublin Business School)',
        'Griffith College',
        'NCI (National College of Ireland)',
        'RCSI',
        'IADT'
    ];

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        // Instant update for non-search filters
        if (key !== 'searchPlace') {
            onFilterChange(newFilters);
        }
    };

    // Fetch suggestions from Nominatim (Dublin focused)
    useEffect(() => {
        if (!filters.searchPlace || filters.searchPlace.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                // Simpler query for better results, still focusing on Ireland
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(filters.searchPlace + (filters.searchPlace.toLowerCase().includes('dublin') ? '' : ' Dublin'))}&addressdetails=1&limit=6`;
                const response = await fetch(url, { headers: { 'User-Agent': 'StayNest-App' } });
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Autocomplete error:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 400); // Faster trigger
        return () => clearTimeout(timer);
    }, [filters.searchPlace]);

    const handleSuggestionClick = (suggestion) => {
        const placeName = suggestion.display_name.split(',')[0];
        const subName = suggestion.address ?
            (suggestion.address.suburb || suggestion.address.city_district || suggestion.address.city || 'Dublin') :
            'Dublin';

        const displayName = `${placeName}, ${subName}`;
        const newFilters = { ...filters, searchPlace: displayName };
        setFilters(newFilters);
        setSuggestions([]);
        setShowSuggestions(false);
        onFilterChange(newFilters);
    };

    // Real-time filtering with debounce for parent - MUCH FASTER
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 300); // 300ms for responsiveness
        return () => clearTimeout(timer);
    }, [filters.searchPlace]);

    const handleSearchClick = () => {
        onFilterChange(filters);
        setShowSuggestions(false);
    };

    return (
        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
            {/* Main Search Bar */}
            <div className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 10px 10px 20px',
                borderRadius: '50px',
                gap: '12px',
                position: 'relative',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                background: 'white',
                border: '1px solid #F1F5F9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, position: 'relative' }}>
                    <span className="material-icons-round" style={{ color: 'var(--color-brand)', fontSize: '22px' }}>search</span>
                    <input
                        type="text"
                        placeholder="Where are you looking?"
                        value={filters.searchPlace}
                        onChange={(e) => handleChange('searchPlace', e.target.value)}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            padding: '12px 0',
                            fontSize: '15px',
                            fontWeight: '600',
                            outline: 'none',
                            width: '100%',
                            color: 'var(--color-text-pri)'
                        }}
                    />
                    {loading && (
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className="searching-spinner" style={{
                                width: '16px', height: '16px', border: '2px solid #EFF6FF',
                                borderTopColor: 'var(--color-brand)', borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                    )}

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (filters.searchPlace.length >= 3) && (
                        <div className="glass-panel" style={{
                            position: 'absolute',
                            top: 'calc(100% + 20px)',
                            left: '0',
                            right: '-10px',
                            minWidth: '300px',
                            borderRadius: '24px',
                            zIndex: 10000,
                            padding: '12px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #E2E8F0'
                        }}>
                            {suggestions.length > 0 ? (
                                suggestions.map((s, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSuggestionClick(s)}
                                        style={{
                                            padding: '14px', borderRadius: '16px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            transition: 'var(--transition-smooth)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{
                                            background: 'var(--color-brand-light)',
                                            borderRadius: '12px', width: '40px', height: '40px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <span className="material-icons-round" style={{ color: 'var(--color-brand)', fontSize: '20px' }}>location_on</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-pri)' }}>{s.display_name.split(',')[0]}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-sec)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {s.display_name.split(',').slice(1, 4).join(',')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : !loading && (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-sec)', fontSize: '14px' }}>
                                    <span className="material-icons-round" style={{ display: 'block', marginBottom: '8px', opacity: 0.5 }}>map</span>
                                    No locations found. Try "Dublin"
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSearchClick}
                    className="btn-primary"
                    style={{
                        width: 'auto',
                        height: '48px',
                        padding: '0 24px',
                        borderRadius: '30px',
                        fontSize: '14px',
                        boxShadow: 'none'
                    }}
                >
                    Search
                </button>
            </div>

            {/* Quick Filters - Wrapped to avoid scroll */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                flexWrap: 'wrap',
                justifyContent: 'flex-start'
            }}>
                <div style={{ position: 'relative', flex: '1 1 140px' }}>
                    <select
                        value={filters.selectedCollege}
                        onChange={(e) => handleChange('selectedCollege', e.target.value)}
                        style={{
                            background: 'white',
                            border: '1px solid #F1F5F9',
                            borderRadius: '16px',
                            padding: '10px 14px 10px 36px',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: 'var(--color-text-sec)',
                            outline: 'none',
                            appearance: 'none',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                            width: '100%'
                        }}
                    >
                        <option value="">All Colleges</option>
                        {universities.map(uni => (
                            <option key={uni} value={uni}>{uni}</option>
                        ))}
                    </select>
                    <span className="material-icons-round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--color-brand)', pointerEvents: 'none' }}>school</span>
                </div>


                <div
                    onClick={() => handleChange('billsIncluded', !filters.billsIncluded)}
                    style={{
                        background: filters.billsIncluded ? 'var(--color-success)' : 'white',
                        color: filters.billsIncluded ? 'white' : 'var(--color-text-sec)',
                        border: '1px solid',
                        borderColor: filters.billsIncluded ? 'var(--color-success)' : '#F1F5F9',
                        padding: '10px 16px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '700',
                        flex: '1 1 140px',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '18px' }}>
                        {filters.billsIncluded ? 'check_circle' : 'receipt_long'}
                    </span>
                    <span>Bills Included</span>
                </div>

                <div style={{
                    background: 'white',
                    border: '1px solid #F1F5F9',
                    borderRadius: '16px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1 1 100%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    overflow: 'visible'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-brand)' }}>payments</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Max Monthly (Fig: €{filters.maxPrice})</span>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '900',
                                color: 'var(--color-brand)',
                                background: 'var(--color-brand-light)',
                                padding: '4px 10px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                textAlign: 'center',
                                boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.1)'
                            }}>
                                €{filters.maxPrice}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="4000"
                            step="50"
                            value={filters.maxPrice}
                            onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                height: '5px',
                                accentColor: 'var(--color-brand)',
                                cursor: 'pointer',
                                display: 'block'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
