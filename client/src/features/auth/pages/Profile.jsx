import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    // Mock User Data
    const user = {
        name: 'Aiswarya KS',
        email: 'aiswarya@example.com',
        role: 'Tenant',
        joined: 'Dec 2025'
    };

    const handleLogout = () => {
        // Clear auth state logic here
        navigate('/login');
    };

    return (
        <div style={{ padding: '24px', paddingBottom: '80px' }}>
            <h1>My Profile</h1>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', marginTop: '20px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--color-primary-light)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-icons-round" style={{ fontSize: '40px', color: 'var(--color-primary)' }}>person</span>
                </div>
                <h2 style={{ margin: '0 0 4px' }}>{user.name}</h2>
                <p style={{ color: '#666', margin: 0 }}>{user.email}</p>
                <span style={{ display: 'inline-block', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginTop: '12px', fontWeight: 'bold', color: '#555' }}>
                    {user.role}
                </span>
            </div>

            <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Settings</h3>

                <div onClick={() => navigate('/tenant/favorites')} style={settingItemStyle}>
                    <span className="material-icons-round" style={{ color: '#666' }}>favorite</span>
                    Saved Homes
                </div>

                <div onClick={() => navigate('/notifications')} style={settingItemStyle}>
                    <span className="material-icons-round" style={{ color: '#666' }}>notifications</span>
                    Notifications
                </div>

                <div style={settingItemStyle}>
                    <span className="material-icons-round" style={{ color: '#666' }}>lock</span>
                    Privacy & Security
                </div>

                <div style={settingItemStyle}>
                    <span className="material-icons-round" style={{ color: '#666' }}>help</span>
                    Help & Support
                </div>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    width: '100%',
                    padding: '16px',
                    marginTop: '32px',
                    borderRadius: '12px',
                    border: '1px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Log Out
            </button>
        </div>
    );
};

const settingItemStyle = {
    background: 'white',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    border: '1px solid #eee'
};

export default Profile;
