import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewListing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '24px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none' }}><span className="material-icons-round">arrow_back</span></button>
                <h1>Post New Listing</h1>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Listing Posted!'); navigate('/broker/dashboard'); }}>
                <h3 style={{ marginBottom: '12px' }}>Details</h3>
                <input type="text" placeholder="Title (e.g. Studio in D2)" className="input-field" />
                <input type="number" placeholder="Monthly Rent (€)" className="input-field" />
                <input type="text" placeholder="Address / Eircode" className="input-field" />

                <h3 style={{ marginBottom: '12px', marginTop: '20px' }}>Description</h3>
                <textarea className="input-field" rows="4" placeholder="Describe the property..."></textarea>

                <h3 style={{ marginBottom: '12px', marginTop: '20px' }}>Amenities</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {['Wifi', 'Heating', 'Bins', 'Parking', 'Ensuite'].map(tag => (
                        <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#F9FAFB', borderRadius: '20px', border: '1px solid #ddd' }}>
                            <input type="checkbox" /> {tag}
                        </label>
                    ))}
                </div>

                <div style={{ marginTop: '32px' }}>
                    <button className="btn-primary" type="submit">Publish Listing</button>
                </div>
            </form>
        </div>
    );
};

export default NewListing;
