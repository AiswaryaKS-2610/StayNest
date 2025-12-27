import React from 'react';
import ListingCard from '../components/ListingCard';

const Favorites = () => {
    // Mock Data
    const favorites = [
        { id: 1, title: 'Modern Studio near Trinity', price: 1800, location: 'Dublin 2', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', tags: ['bills', 'wifi'], rtb: true },
    ];

    return (
        <div style={{ padding: '16px' }}>
            <h1>Saved Homes</h1>
            {favorites.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    {favorites.map(item => (
                        <ListingCard key={item.id} listing={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
