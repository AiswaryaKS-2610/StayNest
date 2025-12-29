const API_URL = 'https://staynest-6vsv.onrender.com/api';

export const fetchListings = async () => {
    try {
        const response = await fetch(`${API_URL}/listings`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        return []; // Return empty array on error
    }
};
