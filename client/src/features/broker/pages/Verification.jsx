import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending'); // pending, uploaded

    const handleUpload = () => {
        // Mock upload logic
        setStatus('uploading');
        setTimeout(() => {
            setStatus('uploaded');
            alert("Documents uploaded! Admin will review shortly.");
            navigate('/broker/dashboard');
        }, 1500);
    };

    return (
        <div style={{ padding: '24px' }}>
            <h2>Broker Verification</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>To prevent scams, StayNest requires all brokers to verify their identity.</p>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ marginTop: 0 }}>Step 1: Government ID</h3>
                <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    color: '#888',
                    marginBottom: '20px'
                }}>
                    Tap to upload Passport / Driving License
                </div>

                <h3 style={{ marginTop: 0 }}>Step 2: Proof of Address</h3>
                <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    color: '#888',
                    marginBottom: '24px'
                }}>
                    Tap to upload Utility Bill / Bank Statement
                </div>

                <button className="btn-primary" onClick={handleUpload} disabled={status === 'uploading'}>
                    {status === 'uploading' ? 'Uploading...' : 'Submit for Review'}
                </button>
            </div>
        </div>
    );
};

export default Verification;
