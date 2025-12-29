import React, { useState, useEffect } from 'react';
import PlacesAutocomplete from '../../common/components/PlacesAutocomplete';

const COLLEGE_LOCATIONS = {
    'Trinity College': { lat: 53.3438, lng: -6.2546 },
    'UCD': { lat: 53.3050, lng: -6.2200 },
    'DCU': { lat: 53.3850, lng: -6.2565 },
    'UCC': { lat: 51.8935, lng: -8.4919 },
    'TU Dublin': { lat: 53.3549, lng: -6.2795 },
    'University of Galway': { lat: 53.2778, lng: -9.0619 },
    'DBS (Dublin Business School)': { lat: 53.3406, lng: -6.2656 },
    'Griffith College': { lat: 53.3314, lng: -6.2786 },
    'NCI (National College of Ireland)': { lat: 53.3489, lng: -6.2432 },
    'RCSI': { lat: 53.3392, lng: -6.2631 },
    'IADT': { lat: 53.2802, lng: -6.1526 }
};

const SearchFilters = ({ onFilterChange, initialFilters }) => {
    const [filters, setFilters] = useState(initialFilters || {
        maxPrice: 3000,
        selectedCollege: null, 
        searchPlace: '',
        billsIncluded: false,
    });

    
    useEffect(() => {
        if (initialFilters) setFilters(initialFilters);
    }, [initialFilters]);

    const universities = Object.keys(COLLEGE_LOCATIONS);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        let newFilters = { ...filters, [key]: value };

        
        if (key === 'selectedCollege') {
            const collegeName = value;
            if (collegeName && COLLEGE_LOCATIONS[collegeName]) {
                newFilters.selectedCollege = {
                    name: collegeName,
                    ...COLLEGE_LOCATIONS[collegeName]
                };
            } else {
                newFilters.selectedCollege = null;
            }
        }

        setFilters(newFilters);
        
        if (key !== 'searchPlace') {
            onFilterChange(newFilters);
        }
    };

    const handlePlaceSelect = (placeData) => {
        const newFilters = {
            ...filters,
            searchPlace: placeData.address,
            searchCoords: { lat: placeData.lat, lng: placeData.lng }
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 300); 
        return () => clearTimeout(timer);
    }, [filters.searchPlace]);

    const handleSearchClick = () => {
        onFilterChange(filters);
        setShowSuggestions(false);
    };

    return (
        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
            {}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                padding: '12px 16px',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, position: 'relative' }}>
                    <PlacesAutocomplete
                        value={filters.searchPlace}
                        onChange={(value) => handleChange('searchPlace', value)}
                        onSelect={handlePlaceSelect}
                        placeholder="🔍 Search Dublin neighborhoods..."
                    />
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

            {}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                flexWrap: 'wrap',
                justifyContent: 'flex-start'
            }}>
                {}
                <div style={{ position: 'relative', flex: '0 0 auto', minWidth: '180px' }}>
                    <select
                        value={filters.selectedCollege?.name || ''}
                        onChange={(e) => handleChange('selectedCollege', e.target.value)}
                        style={{
                            background: 'white',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '10px 32px 10px 36px', 
                            fontSize: '13px',
                            fontWeight: '600',
                            color: filters.selectedCollege ? 'var(--color-brand)' : '#64748B',
                            cursor: 'pointer',
                            outline: 'none',
                            width: '100%',
                            height: '42px', 
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            backgroundImage: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        <option value="">🎓 All Colleges</option>
                        {universities.map(uni => (
                            <option key={uni} value={uni}>{uni}</option>
                        ))}
                    </select>
                    <span className="material-icons-round" style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        color: 'var(--color-brand)',
                        pointerEvents: 'none'
                    }}>school</span>
                    <span className="material-icons-round" style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        color: '#94A3B8',
                        pointerEvents: 'none'
                    }}>expand_more</span>
                </div>


                <div
                    onClick={() => handleChange('billsIncluded', !filters.billsIncluded)}
                    style={{
                        background: filters.billsIncluded ? 'var(--color-success)' : 'white',
                        color: filters.billsIncluded ? 'white' : 'var(--color-text-sec)',
                        border: '1px solid',
                        borderColor: filters.billsIncluded ? 'var(--color-success)' : '#F1F5F9',
                        padding: '0 16px',
                        height: '42px', 
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '700',
                        flex: '0 0 auto',
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
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1 1 300px', 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    overflow: 'visible',
                    height: '42px'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-brand)' }}>payments</span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Max: €{filters.maxPrice}</span>
                        <input
                            type="range"
                            min="500"
                            max="4000"
                            step="50"
                            value={filters.maxPrice}
                            onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
                            style={{
                                flex: 1,
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
