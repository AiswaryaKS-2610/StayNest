import React from 'react';

const ListingCard = ({ listing }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            cursor: 'pointer'
        }}>
            <div style={{ height: '240px', background: '#f0f0f0', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '20px', color: '#222' }}>favorite_border</span>
                </button>
                {listing.rtb && (
                    <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'rgba(255,255,255,0.95)', color: '#222',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        RTB Registered
                    </span>
                )}
            </div>
            <div style={{ padding: '12px 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#222' }}>{listing.location}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-icons-round" style={{ fontSize: '14px', color: '#222' }}>star</span>
                        <span style={{ fontSize: '14px', color: '#222' }}>4.8</span>
                    </div>
                </div>

                <p style={{ margin: '4px 0', color: '#717171', fontSize: '15px' }}>{listing.title}</p>
                <p style={{ margin: '0', color: '#717171', fontSize: '15px' }}>
                    <span style={{ fontWeight: '600', color: '#222' }}>€{listing.price}</span> month
                </p>
            </div>
        </div>
    );
};
export default ListingCard;
