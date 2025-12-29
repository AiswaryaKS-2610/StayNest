import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import Reviews from '../components/Reviews';
import { auth, db } from '../../../firebase.config';
import { collection, query, where, getDocs, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [hasMessaged, setHasMessaged] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser || !id) return;

        const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
            if (doc.exists()) {
                const favorites = doc.data().favorites || [];
                setIsFavorite(favorites.includes(id));
            }
        });

        return () => unsubscribe();
    }, [currentUser, id]);

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            alert("Please login to save favorites.");
            navigate('/login');
            return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        try {
            if (isFavorite) {
                await updateDoc(userRef, { favorites: arrayRemove(id) });
            } else {
                await updateDoc(userRef, { favorites: arrayUnion(id) });
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: property?.title || 'StayNest Property',
            text: `Check out this property on StayNest: ${property?.title}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`https://staynest-6vsv.onrender.com/api/listings`);
                if (response.ok) {
                    const data = await response.json();
                    const found = data.find(p => p.id === id);
                    if (found) {
                        setProperty(found);
                        const brokerId = found.ownerUid || found.brokerId;
                        if (!brokerId) {
                            console.warn("Property listing is missing both ownerUid and brokerId:", found);
                        }
                        
                        checkMessageHistory(brokerId);
                    }
                }
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();

        
        fetch(`https://staynest-6vsv.onrender.com/api/listings/${id}/view`, { method: 'PUT' })
            .catch(err => console.error("Error incrementing view count:", err));
    }, [id]);

    const checkMessageHistory = async (brokerId) => {
        const user = auth.currentUser;
        if (!user || !brokerId) return;

        try {
            const q = query(
                collection(db, "chats"),
                where("participants", "array-contains", user.uid)
            );
            const querySnapshot = await getDocs(q);
            
            const exists = querySnapshot.docs.some(doc => doc.data().participants.includes(brokerId));
            setHasMessaged(exists);
        } catch (error) {
            console.error("Error checking message history:", error);
        }
    };

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="spinner-small" style={{ margin: '0 auto' }}></div>
            <p>Loading your next home...</p>
        </div>
    );

    if (!property) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#222' }}>Aww, we couldn't find that property.</h2>
            <button className="btn-primary" onClick={() => navigate('/tenant/dashboard')}>Back to Search</button>
        </div>
    );

    const images = property.images && property.images.length > 0 ? property.images : [property.image || 'https:

    const getIconForAmenity = (name) => {
        const icons = {
            'Wifi': 'wifi',
            'Heating': 'wb_sunny',
            'Bins': 'delete_outline',
            'Parking': 'local_parking',
            'Ensuite': 'bathtub',
            'Kitchen': 'restaurant',
            'Laundry': 'local_laundry_service',
            'Gym': 'fitness_center',
            'Desk Space': 'desktop_mac',
            'Elevator': 'elevator',
            'Security': 'security',
            'Fridge': 'kitchen',
            'Microwave': 'microwave',
            'TV': 'tv',
            'Diswasher': 'flatware'
        };
        return icons[name] || 'check_circle_outline';
    };

    return (
        <div style={{ paddingBottom: '120px', background: 'white', minHeight: '100vh', position: 'relative' }}>
            {}
            <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} className="heart-button" style={{ background: 'white' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleShare} className="heart-button" style={{ background: 'white' }}>
                        <span className="material-icons-round">share</span>
                    </button>
                    <button
                        onClick={toggleFavorite}
                        className={`heart-button ${isFavorite ? 'active' : ''}`}
                        style={{ background: 'white' }}
                    >
                        <span className="material-icons-round">
                            {isFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm("Report this listing as suspicious?")) {
                                
                                alert("Thank you. Our safety team will review this listing shortly.");
                            }
                        }}
                        className="heart-button"
                        style={{ background: 'white', color: '#EF4444' }}
                        title="Report Listing"
                    >
                        <span className="material-icons-round">flag</span>
                    </button>
                </div>
            </div>

            {}
            <div style={{ maxWidth: '1120px', margin: '24px auto', padding: '0 24px', height: '400px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', borderRadius: '24px', overflow: 'hidden' }}>
                {}
                <div style={{ gridArea: '1 / 1 / 3 / 2', position: 'relative', cursor: 'pointer' }} onClick={() => setCurrentImageIndex(0)}>
                    <img
                        src={images[0]}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="hover-scale"
                    />
                </div>

                {}
                <div style={{ gridArea: '1 / 2 / 2 / 3', cursor: 'pointer' }} onClick={() => setCurrentImageIndex(1)}>
                    <img src={images[1] || images[0]} alt="View 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="hover-scale" />
                </div>
                <div style={{ gridArea: '1 / 3 / 2 / 4', cursor: 'pointer' }} onClick={() => setCurrentImageIndex(2)}>
                    <img src={images[2] || images[0]} alt="View 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="hover-scale" />
                </div>
                <div style={{ gridArea: '2 / 2 / 3 / 3', cursor: 'pointer' }} onClick={() => setCurrentImageIndex(3)}>
                    <img src={images[3] || images[0]} alt="View 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="hover-scale" />
                </div>
                <div style={{ gridArea: '2 / 3 / 3 / 4', position: 'relative', cursor: 'pointer' }} onClick={() => setCurrentImageIndex(4)}>
                    <img src={images[4] || images[0]} alt="View 5" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="hover-scale" />
                    {images.length > 5 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px' }}>
                            +{images.length - 5} photos
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
                {}
                <div style={{ color: 'var(--color-brand)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Verified Premium Property
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '32px', margin: 0, fontWeight: '800', color: 'var(--color-text-pri)', letterSpacing: '-0.5px' }}>
                        {property.title}
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-icons-round" style={{ fontSize: '18px', color: '#F59E0B' }}>star</span>
                        <span style={{ fontWeight: '800', fontSize: '15px' }}>{property.rating || 'New'}</span>
                        <span style={{ color: 'var(--color-text-sec)', fontSize: '14px', textDecoration: 'underline' }}>({property.reviewCount || 0} reviews)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-sec)', fontSize: '15px', fontWeight: '500' }}>
                        <span className="material-icons-round" style={{ fontSize: '18px' }}>location_on</span>
                        {property.location}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '24px 0', marginBottom: '32px', display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span className="material-icons-round" style={{ color: 'var(--color-text-hint)', display: 'block', marginBottom: '6px' }}>home</span>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{property.subType || property.type || 'Entire Flat'}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span className="material-icons-round" style={{ color: 'var(--color-text-hint)', display: 'block', marginBottom: '6px' }}>bed</span>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{property.bedrooms || 0} {(property.bedrooms === '1' || property.bedrooms === 1) ? 'Bedroom' : 'Bedrooms'}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span className="material-icons-round" style={{ color: 'var(--color-text-hint)', display: 'block', marginBottom: '6px' }}>groups</span>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>Up to {property.guests || 1} {property.guests === '1' || property.guests === 1 ? 'GUEST' : 'GUESTS'}</span>
                    </div>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Description</h3>
                <p style={{ color: 'var(--color-text-sec)', lineHeight: '1.8', fontSize: '16px', marginBottom: '40px', fontWeight: '400' }}>
                    {property.description}
                </p>

                <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>What this place offers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '48px' }}>
                    {property.amenities && property.amenities.map(item => (
                        <div key={item} style={{
                            padding: '16px',
                            border: '1px solid #F1F5F9',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'white'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '20px', color: 'var(--color-brand)' }}>
                                {getIconForAmenity(item)}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-pri)' }}>{item}</span>
                        </div>
                    ))}
                </div>

                {}
                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px', background: '#F8FAFC', border: 'none' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <span className="material-icons-round" style={{ fontSize: '32px', color: 'var(--color-brand)' }}>verified_user</span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>Verified Host</h4>
                        <p style={{ margin: 0, color: 'var(--color-text-sec)', fontSize: '14px' }}>Typically responds within an hour</p>
                    </div>
                    <button
                        onClick={() => navigate(`/messages/${property.ownerUid || 'admin'}`)}
                        style={{ background: 'white', border: '1px solid #E2E8F0', padding: '10px 18px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                    >
                        Contact
                    </button>
                </div>

                <Reviews propertyId={id} canWrite={hasMessaged} />
            </div>

            {}
            <div className="glass-panel" style={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                right: '24px',
                padding: '16px 24px',
                borderRadius: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                animation: 'slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-brand)' }}>€{property.price}</span>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-sec)', fontWeight: '600' }}>/ month</span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: property.billsIncluded ? 'var(--color-success)' : 'var(--color-text-hint)', textTransform: 'uppercase', marginTop: '2px' }}>
                        {property.billsIncluded ? 'All bills included' : 'Utilities not included'}
                    </div>
                </div>
                <button
                    className="btn-primary"
                    style={{ padding: '14px 32px', borderRadius: '16px', width: 'auto' }}
                    onClick={() => navigate(`/messages/${property.ownerUid || 'admin'}`, {
                        state: {
                            propertyId: id,
                            propertyTitle: property.title
                        }
                    })}
                >
                    Message Broker
                </button>
            </div>
        </div>
    );
};

const roundButtonStyle = {
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    cursor: 'pointer'
};

const navButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

const statBoxStyle = {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: '#222'
};

export default PropertyDetails;
