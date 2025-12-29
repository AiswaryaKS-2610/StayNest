import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase.config';
import { doc, onSnapshot } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../common/components/BottomNav';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        
        const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), async (userDoc) => {
            if (userDoc.exists()) {
                const favoriteIds = userDoc.data().favorites || [];

                if (favoriteIds.length === 0) {
                    setFavorites([]);
                    setLoading(false);
                    return;
                }

                
                try {
                    const response = await fetch('https://staynest-6vsv.onrender.com/api/listings');
                    if (response.ok) {
                        const allListings = await response.json();
                        const myFavorites = allListings.filter(listing => favoriteIds.includes(listing.id));
                        setFavorites(myFavorites);
                    }
                } catch (error) {
                    console.error("Error fetching favorited listings:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px' }}>
                    <span className="material-icons-round" style={{ fontSize: '80px', color: '#E2E8F0' }}>favorite_border</span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Save your favorites</h2>
                <p style={{ color: 'var(--color-text-sec)', marginBottom: '32px' }}>Log in to see your saved homes and sync them across devices.</p>
                <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }}>Log In</button>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '100px 24px', textAlign: 'center' }}>
                <div className="spinner-small" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '16px', color: 'var(--color-text-sec)' }}>Finding your saved homes...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Wishlist</h1>
                <p style={{ margin: 0, color: 'var(--color-text-sec)', fontSize: '15px', fontWeight: '500' }}>
                    {favorites.length} {favorites.length === 1 ? 'home' : 'homes'} saved
                </p>
            </div>

            {favorites.length === 0 ? (
                <div style={{
                    padding: '80px 24px',
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: '24px',
                    border: '1px dashed #CBD5E1'
                }}>
                    <div style={{
                        width: '80px', height: '80px', background: 'var(--color-brand-light)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-brand)'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '40px' }}>favorite_border</span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No saved homes yet</h2>
                    <p style={{ color: 'var(--color-text-sec)', marginBottom: '32px', fontSize: '14px' }}>
                        When you see a place you like, tap the heart icon to save it here.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/tenant/dashboard')} style={{ width: 'auto', padding: '12px 24px' }}>
                        Start Searching
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '24px'
                }}>
                    {favorites.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
            <BottomNav />
        </div>
    );
};

export default Favorites;
