import React, { useState, useEffect, useRef } from 'react';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MAPBOX_TOKEN = 'sk.eyJ1IjoiYWlzd2FyeWFrcyIsImEiOiJjbWpxZjNndDcyN2oxM21xeXB4a2JvNnExIn0.hv4cRF70Ccs1rp7Igy70BQ';

const PlacesAutocomplete = ({ value, onChange, placeholder = 'Search for a location...', onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const debounceTimer = useRef(null);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
                `access_token=${MAPBOX_TOKEN}&` +
                `country=IE&` + 
                `limit=5&` +
                `types=address,place,locality,neighborhood`
            );

            const data = await response.json();
            setSuggestions(data.features || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);

        
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(newValue);
        }, 300);
    };

    const handleSelectSuggestion = (suggestion) => {
        const address = suggestion.place_name;
        const [lng, lat] = suggestion.center;

        setInputValue(address);
        onChange(address);
        setShowSuggestions(false);
        setSuggestions([]);

        if (onSelect) {
            onSelect({
                address,
                lat,
                lng,
                fullData: suggestion
            });
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => inputValue.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit'
                }}
                onFocusCapture={(e) => {
                    e.target.style.borderColor = 'var(--color-brand)';
                }}
                onBlurCapture={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10000,
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.id || index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #F1F5F9' : 'none',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'white';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span className="material-icons-round" style={{
                                    fontSize: '20px',
                                    color: 'var(--color-brand)',
                                    marginTop: '2px'
                                }}>
                                    location_on
                                </span>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: 'var(--color-text-pri)',
                                        marginBottom: '2px'
                                    }}>
                                        {suggestion.text}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'var(--color-text-sec)'
                                    }}>
                                        {suggestion.place_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlacesAutocomplete;
