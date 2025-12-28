import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase.config';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    getDoc,
    orderBy
} from 'firebase/firestore';

const Reviews = ({ propertyId, canWrite }) => {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!propertyId) return;

        const q = query(
            collection(db, "reviews"),
            where("propertyId", "==", propertyId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort manually by createdAt desc since we removed orderBy to avoid index errors
            const sorted = fetchedReviews.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });

            setReviews(sorted);
        });

        return () => unsubscribe();
    }, [propertyId]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            }
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || !propertyId) return;

        setSubmitting(true);
        try {
            // 1. Add the review
            await addDoc(collection(db, "reviews"), {
                propertyId,
                userId: user.uid,
                userName: userData?.fullName || user.displayName || 'Tenant',
                rating: Number(rating),
                comment,
                createdAt: serverTimestamp()
            });

            // 2. Calculate new average rating
            const updatedReviews = [...reviews, { rating: Number(rating) }];
            const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = (totalRating / updatedReviews.length).toFixed(1);

            // 3. Update the listing document
            const listingRef = doc(db, "listings", propertyId);
            const listingDoc = await getDoc(listingRef);

            if (listingDoc.exists()) {
                await updateDoc(listingRef, {
                    rating: Number(avgRating),
                    reviewCount: updatedReviews.length
                });
            }

            setComment('');
            setShowForm(false);
            alert('Rating submitted! Thank you.');
        } catch (error) {
            console.error("Error submitting review:", error);
            alert('Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Reviews ({reviews.length})</h3>
                {canWrite && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-brand)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Rating</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="material-icons-round"
                                    style={{
                                        cursor: 'pointer',
                                        color: star <= rating ? '#FFB23F' : '#ddd',
                                        fontSize: '28px'
                                    }}
                                >
                                    star
                                </span>
                            ))}
                        </div>
                    </div>
                    <textarea
                        required
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginBottom: '12px', minHeight: '80px', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ flex: 1, padding: '10px', background: 'var(--color-cta)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(34,197,94,0.2)' }}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            style={{ flex: 1, padding: '10px', background: '#eee', color: '#222', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {reviews.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', background: '#F7F7F7', borderRadius: '12px', marginBottom: '24px' }}>
                    <span className="material-icons-round" style={{ fontSize: '24px', color: '#ccc', marginBottom: '4px', display: 'block' }}>rate_review</span>
                    <p style={{ margin: 0, color: '#717171', fontSize: '13px' }}>No reviews yet. Message the broker to unlock yours!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
                    {reviews.map(review => (
                        <div key={review.id} style={{ minWidth: '220px', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-icons-round" style={{ fontSize: '14px', color: '#717171' }}>person</span>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{review.userName}</div>
                            </div>
                            <div style={{ color: '#222', display: 'flex', gap: '1px', marginBottom: '4px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-icons-round" style={{ fontSize: '12px', color: i < review.rating ? '#FF5A5F' : '#ddd' }}>star</span>
                                ))}
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: '#484848', lineHeight: 1.4, height: '4em', overflow: 'hidden' }}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {!canWrite && (
                <div style={{
                    padding: '12px',
                    background: '#fcfcfc',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    color: '#717171',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '16px' }}>lock</span>
                    Message the broker to unlock reviews
                </div>
            )}
        </div>
    );
};

export default Reviews;
