import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../../common/components/BottomNav';
import { logoutUser, getCurrentUser } from '../services/authService';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isBrokerView = location.pathname.startsWith('/broker');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            await logoutUser();
            navigate('/login');
        }
    };

    const handleProfilePicChange = async (e) => {
        if (!e.target.files || !e.target.files[0]) return;

        setUploading(true);
        try {
            const file = e.target.files[0];
            const cloudName = 'daszhocrj';
            const uploadPreset = 'staynest_preset';

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', uploadPreset);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();
            const photoURL = result.secure_url;

            // Update Firestore
            const { auth, db } = await import('../../../firebase.config');
            const { doc, updateDoc } = await import('firebase/firestore');
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { photoURL });

            setUser(prev => ({ ...prev, photoURL }));
            alert("Profile picture updated!");
        } catch (error) {
            console.error("Profile pic error:", error);
            alert("Failed to update profile picture.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="spinner-small" style={{ margin: '0 auto' }}></div>
        </div>
    );

    return (
        <div style={{ padding: isBrokerView ? '0' : '16px', paddingBottom: '100px', maxWidth: isBrokerView ? '100%' : '600px', margin: isBrokerView ? '0' : '0 auto' }}>
            <h1 style={{ fontSize: isBrokerView ? '28px' : '24px', fontWeight: '800', color: 'var(--color-brand)', marginBottom: '32px', letterSpacing: '-0.5px' }}>Profile</h1>

            <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                marginBottom: '32px'
            }}>
                <div
                    onClick={() => document.getElementById('profile-pic-input').click()}
                    style={{
                        width: '100px',
                        height: '100px',
                        background: 'var(--color-brand)',
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 16px rgba(30,58,138,0.15)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span className="material-icons-round" style={{ fontSize: '48px' }}>person</span>
                    )}

                    {uploading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="spinner-small" style={{ borderTopColor: 'white', width: '20px', height: '20px' }}></div>
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.3)', padding: '2px 0', fontSize: '10px', fontWeight: '700' }}>EDIT</div>
                </div>
                <input type="file" id="profile-pic-input" hidden onChange={handleProfilePicChange} accept="image/*" />
                <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '800', color: 'var(--color-text-pri)' }}>
                    {user?.fullName || 'User Name'}
                </h2>
                <p style={{ color: '#64748B', margin: 0, fontSize: '15px', fontWeight: '500' }}>
                    {user?.email}
                </p>
                <div style={{
                    display: 'inline-block',
                    background: 'var(--color-brand-light)',
                    padding: '6px 16px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    marginTop: '16px',
                    fontWeight: '800',
                    color: 'var(--color-brand)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {user?.role || 'Tenant'}
                </div>
            </div>

            <div style={{ marginTop: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-pri)', marginBottom: '16px', paddingLeft: isBrokerView ? '0' : '4px' }}>
                    Account Settings
                </h3>

                {isBrokerView ? (
                    <>
                        <div onClick={() => navigate('/broker/dashboard')} style={settingItemStyle}>
                            <div style={iconBoxStyle}><span className="material-icons-round">dashboard</span></div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: '700', fontSize: '15px' }}>My Dashboard</span>
                                <span style={{ display: 'block', fontSize: '12px', color: '#64748B' }}>Manage your property listings</span>
                            </div>
                            <span className="material-icons-round" style={{ color: '#CBD5E1' }}>chevron_right</span>
                        </div>
                        <div onClick={() => navigate('/broker/verification')} style={settingItemStyle}>
                            <div style={iconBoxStyle}><span className="material-icons-round">verified_user</span></div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: '700', fontSize: '15px' }}>Verification Status</span>
                                <span style={{ display: 'block', fontSize: '12px', color: '#64748B' }}>Upload and check your documents</span>
                            </div>
                            <span className="material-icons-round" style={{ color: '#CBD5E1' }}>chevron_right</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div onClick={() => navigate('/tenant/dashboard')} style={settingItemStyle}>
                            <div style={iconBoxStyle}><span className="material-icons-round">explore</span></div>
                            <span style={{ flex: 1, fontWeight: '700' }}>Explore Homes</span>
                            <span className="material-icons-round" style={{ color: '#CBD5E1' }}>chevron_right</span>
                        </div>
                        <div onClick={() => navigate('/tenant/favorites')} style={settingItemStyle}>
                            <div style={iconBoxStyle}><span className="material-icons-round">favorite_border</span></div>
                            <span style={{ flex: 1, fontWeight: '700' }}>Wishlist</span>
                            <span className="material-icons-round" style={{ color: '#CBD5E1' }}>chevron_right</span>
                        </div>
                    </>
                )}

                {user?.role === 'admin' && (
                    <div onClick={() => navigate('/admin')} style={{ ...settingItemStyle, border: '1.5px solid var(--color-brand-light)', background: '#F0F9FF', marginBottom: '16px' }}>
                        <div style={{ ...iconBoxStyle, background: 'var(--color-brand)', color: 'white' }}>
                            <span className="material-icons-round">admin_panel_settings</span>
                        </div>
                        <span style={{ flex: 1, fontWeight: '800', color: 'var(--color-brand)' }}>Admin Control Panel</span>
                        <span className="material-icons-round" style={{ color: 'var(--color-brand)' }}>chevron_right</span>
                    </div>
                )}

                <div onClick={() => { }} style={settingItemStyle}>
                    <div style={iconBoxStyle}><span className="material-icons-round">notifications_none</span></div>
                    <span style={{ flex: 1, fontWeight: '700' }}>Notifications</span>
                    <span className="material-icons-round" style={{ color: '#CBD5E1' }}>chevron_right</span>
                </div>

                <div onClick={() => { }} style={settingItemStyle}>
                    <div style={iconBoxStyle}><span className="material-icons-round">security</span></div>
                    <span style={{ flex: 1, fontWeight: '700' }}>Privacy & Security</span>
                    <span className="material-icons-round" style={{ color: '#CBD5E1' }}>chevron_right</span>
                </div>

                <div onClick={handleLogout} style={{ ...settingItemStyle, marginTop: '24px', border: '1.5px solid #FEE2E2', background: '#FEF2F2' }}>
                    <div style={{ ...iconBoxStyle, background: '#FEE2E2', color: '#EF4444' }}>
                        <span className="material-icons-round">logout</span>
                    </div>
                    <span style={{ flex: 1, fontWeight: '800', color: '#EF4444' }}>Log Out</span>
                </div>
            </div>

            {!isBrokerView && <BottomNav />}
        </div>
    );
};

const settingItemStyle = {
    background: 'white',
    padding: '16px 20px',
    borderRadius: '18px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    border: '1px solid #E2E8F0',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
};

const iconBoxStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B'
};

export default Profile;
