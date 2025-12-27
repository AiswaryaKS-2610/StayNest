import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import Reviews from '../components/Reviews';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isBookingOpen, setIsBookingOpen] = useState(false); // State for Modal state
    const [property, setProperty] = useState(null);

    // Mock Data Fetch (Replace with API fetch later if needed)
    useEffect(() => {
        const MOCK_DB = [
            {
                id: 1,
                title: 'Modern Studio near Trinity',
                price: 1800,
                location: 'Dublin 2',
                description: 'A beautiful studio apartment located just 5 minutes walk from Trinity College. Fully furnished with high-speed wifi included.',
                amenities: ['Wifi', 'Bills Included', 'Central Heating', 'Washing Machine'],
                broker: { name: 'Conor O\'Brien', verified: true },
                images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
            },
            // Simple fallback if ID doesn't match mock
            {
                id: parseInt(id),
                title: 'Sample Property',
                price: 1500,
                location: 'Dublin',
                description: 'Great property.',
                amenities: ['Wifi'],
                broker: { name: 'StayNest Broker', verified: true },
                images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
            }
        ];

        const found = MOCK_DB.find(p => p.id === parseInt(id)) || MOCK_DB[0];
        setProperty(found);
    }, [id]);

    if (!property) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ paddingBottom: '80px', background: 'white', minHeight: '100vh' }}>
            <div style={{ position: 'relative', height: '300px' }}>
                <img src={property.images[0]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '20px', left: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
            </div>

            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '24px', margin: 0, lineHeight: 1.2 }}>{property.title}</h1>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-primary)' }}>€{property.price}<span style={{ fontSize: '14px', color: '#666' }}>/mo</span></span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <span style={{ background: '#e6f4f1', color: 'var(--color-primary-dark)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        Bills Included
                    </span>
                    <span style={{ background: '#f3f4f6', color: '#666', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
                        Studio
                    </span>
                </div>

                <h3 style={{ fontSize: '18px' }}>Description</h3>
                <p style={{ color: '#555', lineHeight: 1.6 }}>{property.description}</p>

                <h3 style={{ fontSize: '18px', marginTop: '24px' }}>Amenities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    {property.amenities.map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                            <span className="material-icons-round" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>check_circle</span>
                            {item}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '32px', padding: '16px', background: '#F9FAFB', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#ddd', borderRadius: '50%' }}></div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0 }}>{property.broker.name}</h4>
                        {property.broker.verified && <span style={{ color: 'green', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-icons-round" style={{ fontSize: '14px' }}>verified</span> Verified Broker</span>}
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => navigate('/messages/1')}>Message</button>
                </div>

                {/* Reviews Section */}
                <Reviews />
            </div>

            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '16px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '12px' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => setIsBookingOpen(true)}>Request Viewing</button>
                <button style={{ width: '50px', border: '1px solid #ddd', borderRadius: '12px', background: 'white' }}>
                    <span className="material-icons-round" style={{ color: '#666' }}>favorite_border</span>
                </button>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                propertyTitle={property.title}
            />
        </div>
    );
};

export default PropertyDetails;
