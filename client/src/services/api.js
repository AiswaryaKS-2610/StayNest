const API_URL = 'https://staynest-6vsv.onrender.com/api';

// Simple In-Memory Cache
const CACHE = {
    listings: {
        data: null,
        timestamp: 0
    }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 Minutes

export const fetchListings = async (forceRefresh = false) => {
    try {
        // Return Cached Data if valid
        const now = Date.now();
        if (!forceRefresh && CACHE.listings.data && (now - CACHE.listings.timestamp < CACHE_DURATION)) {
            console.log("Serving listings from cache");
            return CACHE.listings.data;
        }

        const response = await fetch(`${API_URL}/listings`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Update Cache
        CACHE.listings.data = data;
        CACHE.listings.timestamp = now;

        return data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return CACHE.listings.data || []; // Return stale cache if error, or empty array
    }
};
