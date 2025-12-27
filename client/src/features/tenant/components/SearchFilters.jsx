import React, { useState } from 'react';

const SearchFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        maxPrice: 2000,
        campuses: [], // Changed to array
        billsIncluded: false,
        heating: 'any',
        roomType: 'any'
    });

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

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleCampus = (uni) => {
        let newCampuses;
        if (filters.campuses.includes(uni)) {
            newCampuses = filters.campuses.filter(c => c !== uni);
        } else {
            newCampuses = [...filters.campuses, uni];
        }
        handleChange('campuses', newCampuses);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            {/* Campus Dropdown - Main Action */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                        padding: '14px 20px',
                        border: '1px solid #EDDDD',
                        borderRadius: '32px',
                        background: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#FF5A5F', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                            <span className="material-icons-round" style={{ color: 'white', fontSize: '18px' }}>search</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>Where to?</span>
                            <span style={{ fontSize: '12px', color: '#717171' }}>
                                {filters.campuses.length > 0 ? `${filters.campuses.length} colleges selected` : 'Select college or area'}
                            </span>
                        </div>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div style={{
                        position: 'absolute', top: '110%', left: 0, right: 0,
                        background: 'white', borderRadius: '24px',
                        marginTop: '4px', zIndex: 100, boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        maxHeight: '300px', overflowY: 'auto', padding: '16px 8px'
                    }}>
                        {universities.map(uni => (
                            <div
                                key={uni}
                                onClick={() => toggleCampus(uni)}
                                style={{
                                    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                                    cursor: 'pointer', borderRadius: '12px',
                                    backgroundColor: filters.campuses.includes(uni) ? '#F7F7F7' : 'transparent'
                                }}
                            >
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '6px',
                                    border: filters.campuses.includes(uni) ? 'none' : '1px solid #ddd',
                                    background: filters.campuses.includes(uni) ? '#FF5A5F' : 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {filters.campuses.includes(uni) && <span className="material-icons-round" style={{ color: 'white', fontSize: '16px' }}>check</span>}
                                </div>
                                <span style={{ fontSize: '15px', color: '#222', fontWeight: filters.campuses.includes(uni) ? '600' : '400' }}>{uni}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {/* Price Filter Pill */}
                <div style={{
                    padding: '8px 16px', borderRadius: '30px', border: '1px solid #ddd',
                    background: 'white', fontSize: '13px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                    <span>Max Price: €{filters.maxPrice}</span>
                    <input
                        type="range"
                        min="500"
                        max="4000"
                        step="50"
                        value={filters.maxPrice}
                        onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
                        style={{ width: '80px', accentColor: '#FF5A5F', height: '4px' }}
                    />
                </div>

                <div
                    onClick={() => handleChange('billsIncluded', !filters.billsIncluded)}
                    style={{
                        padding: '8px 16px', borderRadius: '30px',
                        border: filters.billsIncluded ? '1px solid #222' : '1px solid #ddd',
                        background: filters.billsIncluded ? '#F7F7F7' : 'white',
                        color: '#222', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', cursor: 'pointer'
                    }}
                >
                    Bills Included
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
