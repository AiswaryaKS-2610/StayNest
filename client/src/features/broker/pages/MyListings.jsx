import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyListings = () => {
    const navigate = useNavigate();

    // Mock Data
    const listings = []; // Empty state for now

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>My Listings</h1>
                <button
                    className="btn-primary"
                    style={{ width: 'auto', padding: '8px 16px' }}
                    onClick={() => navigate('/broker/new-listing')}
                >
                    + New
                </button>
            </div>

            {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p>No listings yet.</p>
                    <p>Verified brokers can post unlimited listings.</p>
                </div>
            ) : (
                <div>Listings Grid Here</div>
            )}
        </div>
    );
};

export default MyListings;
