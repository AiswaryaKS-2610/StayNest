import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import TransportModal from './TransportModal';

const ListingCard = ({ listing, searchTarget, collegeTarget, isBrokerView = false }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showTransportModal, setShowTransportModal] = useState(false);
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser || isBrokerView) return;

        // Listen to user's favorites to sync state
        const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
            if (doc.exists()) {
                const favorites = doc.data().favorites || [];
                setIsFavorite(favorites.includes(listing.id));
            }
        });

        return () => unsubscribe();
    }, [currentUser, listing.id, isBrokerView]);

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
                await updateDoc(userRef, {
                    favorites: arrayRemove(listing.id)
                });
            } else {
                await updateDoc(userRef, {
                    favorites: arrayUnion(listing.id)
                });
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    // Helper: Haversine Distance
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Helper: Value Estimation (Walking < 2km, else Transit/Drive)
    const getTravelEstimate = (target) => {
        if (!target || !listing.lat || !listing.lng) return null;

        const dist = getDistance(listing.lat, listing.lng, target.lat, target.lng);
        let time, mode, icon;

        if (dist < 2.0) {
            // Assume Walking (5 km/h) = 12 min/km
            time = Math.ceil(dist * 12);
            mode = 'Walk';
            icon = 'directions_walk';
        } else {
            // Assume Transit/Drive mix (30 km/h) = 2 min/km + 5 min buffer
            time = Math.ceil((dist * 2) + 5);
            mode = 'Transport';
            icon = 'directions_bus'; // or commute
        }

        return {
            name: target.name,
            dist: parseFloat(dist.toFixed(1)),
            time,
            mode,
            icon,
            showTime: time < 60
        };
    };

    const searchCommute = React.useMemo(() => getTravelEstimate(searchTarget), [searchTarget, listing]);
    const collegeCommute = React.useMemo(() => getTravelEstimate(collegeTarget), [collegeTarget, listing]);

    return (
        <>
            <div className="premium-card" style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                {/* Image Container */}
                <div style={{
                    height: '240px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                }}>
                    <img
                        src={(listing.images && listing.images.length > 0) ? listing.images[0] : (listing.image || 'https://via.placeholder.com/400x300?text=No+Image')}
                        alt={listing.title}
                        className="hover-scale"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Gradient Overlay */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '60%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        pointerEvents: 'none'
                    }} />

                    {/* Commute Badges - Stacked if both exist */}
                    <div style={{
                        position: 'absolute', bottom: '12px', right: '12px',
                        display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end'
                    }}>
                        {searchCommute && (
                            <div style={{
                                background: 'white', color: 'var(--color-text-pri)',
                                padding: '6px 12px', borderRadius: '20px',
                                fontSize: '12px', fontWeight: '700',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '16px', color: '#EF4444' }}>location_on</span>
                                {searchCommute.showTime ? `${searchCommute.time} min to Location` : `${searchCommute.dist} km to Location`}
                            </div>
                        )}

                        {collegeCommute && (
                            <div style={{
                                background: 'white', color: 'var(--color-brand)',
                                padding: '6px 12px', borderRadius: '20px',
                                fontSize: '12px', fontWeight: '800',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '16px' }}>{collegeCommute.icon}</span>
                                {collegeCommute.showTime ? `${collegeCommute.time} min to Campus` : `${collegeCommute.dist} km to Campus`}
                            </div>
                        )}
                    </div>

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                        <div style={{
                            background: 'white', padding: '6px 12px', borderRadius: '30px',
                            fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-brand)'
                        }}>
                            {listing.subType || listing.type || 'Entire Home'}
                        </div>
                        {listing.billsIncluded && (
                            <div style={{
                                background: 'var(--color-success)', padding: '6px 12px', borderRadius: '30px',
                                fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'white',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '14px' }}>check_circle</span>
                                Bills
                            </div>
                        )}
                        {listing.brokerVerified && (
                            <div style={{
                                background: 'linear-gradient(135deg, #3B82F6, #1E3A8A)',
                                padding: '6px 12px',
                                borderRadius: '30px',
                                fontSize: '11px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: '14px' }}>verified</span>
                                Verified Host
                            </div>
                        )}
                    </div>

                    {!isBrokerView && (
                        <>
                            <button
                                className={`heart-button ${isFavorite ? 'active' : ''}`}
                                onClick={toggleFavorite}
                                style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}
                            >
                                <span className="material-icons-round">
                                    {isFavorite ? 'favorite' : 'favorite_border'}
                                </span>
                            </button>
                            {(collegeCommute || searchCommute) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowTransportModal(true);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '64px',
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        transition: 'all 0.2s',
                                        zIndex: 10
                                    }}
                                    title="View Routes"
                                >
                                    <span className="material-icons-round" style={{ color: 'var(--color-brand)', fontSize: '20px' }}>
                                        directions
                                    </span>
                                </button>
                            )}
                        </>
                    )}

                    {isBrokerView && (
                        <div style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: 'rgba(0,0,0,0.6)', color: 'white',
                            padding: '6px 12px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: '700',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '16px' }}>visibility</span>
                            {listing.views || 0} views
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-hint)', letterSpacing: '0.5px' }}>
                            {listing.location.toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-icons-round" style={{ fontSize: '16px', color: '#F59E0B' }}>star</span>
                            <span style={{ fontSize: '14px', fontWeight: '800' }}>{listing.rating || 'New'}</span>
                        </div>
                    </div>

                    <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '800', lineHeight: 1.3, color: 'var(--color-text-pri)' }}>
                        {listing.title}
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                        <div>
                            <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-brand)' }}>€{listing.price}</span>
                            <span style={{ fontSize: '13px', color: 'var(--color-text-sec)', marginLeft: '4px' }}>/ month</span>
                        </div>

                        {isBrokerView ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/broker/edit-listing/${listing.id}`);
                                }}
                                className="btn-primary"
                                style={{
                                    width: 'auto',
                                    padding: '8px 20px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    background: 'white',
                                    color: 'var(--color-brand)',
                                    border: '1.5px solid var(--color-brand)'
                                }}
                            >
                                Edit Details
                            </button>
                        ) : (
                            // Minimal distance badge in info if no search/college selected
                            (!searchCommute && !collegeCommute && listing.distanceToSearch) && (
                                <div style={{
                                    background: 'var(--color-brand)',
                                    color: 'white',
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '16px' }}>location_on</span>
                                    {listing.distanceToSearch < 1
                                        ? `${Math.round(listing.distanceToSearch * 1000)}m`
                                        : `${listing.distanceToSearch.toFixed(1)}km`}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <TransportModal
                isOpen={showTransportModal}
                onClose={() => setShowTransportModal(false)}
                property={listing}
                selectedCollege={collegeTarget || searchTarget}
            />
        </>
    );
};

export default ListingCard;
