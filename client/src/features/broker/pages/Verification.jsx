import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { doc, updateDoc } from 'firebase/firestore';

const Verification = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [fetchingStatus, setFetchingStatus] = useState(true);
    const [files, setFiles] = useState({
        front: null,
        back: null,
        address: null
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchVerificationStatus(user);
            } else {
                setFetchingStatus(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchVerificationStatus = async (user) => {
        try {
            if (!user) return;

            const token = await user.getIdToken();
            console.log('Fetching status for:', user.email);

            const response = await fetch('http://localhost:5000/api/verifications/my-verification', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Verification data received:', data);
                setVerificationStatus(data.verification);

                if (data.verification) {
                    console.log('Verification status:', data.verification.status);
                } else {
                    console.log('No verification found for this user');
                    alert(`No verification results for: ${user.email}\nUID: ${user.uid}\n\nPlease make sure this account has been approved by admin.`);
                }
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert(`API Error (${response.status}): ${errorText}`);
            }
        } catch (error) {
            console.error('Error fetching verification status:', error);
            alert(`Network Error: ${error.message}`);
        } finally {
            setFetchingStatus(false);
        }
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
        }
    };

    const uploadToCloudinary = async (file) => {
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
        return result.secure_url;
    };

    const handleSubmit = async () => {
        if (!files.front || !files.back || !files.address) {
            return alert("Please upload all required documents (Front ID, Back ID, and Proof of Address)");
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) return alert("User not found");

            // Upload all 3 files to Cloudinary
            const [frontUrl, backUrl, addressUrl] = await Promise.all([
                uploadToCloudinary(files.front),
                uploadToCloudinary(files.back),
                uploadToCloudinary(files.address)
            ]);

            // Submit verification request to backend
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/verifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    idFront: frontUrl,
                    idBack: backUrl,
                    proofOfAddress: addressUrl
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit verification');
            }

            alert("Documents uploaded successfully! Admin will review your profile shortly.");
            navigate('/broker/dashboard');
        } catch (error) {
            console.error("Verification error:", error);
            alert(error.message || "Failed to upload documents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const dropzoneStyle = (hasFile) => ({
        border: `2.5px dashed ${hasFile ? 'var(--color-success)' : '#E2E8F0'}`,
        borderRadius: '20px',
        padding: '32px',
        textAlign: 'center',
        color: hasFile ? 'var(--color-success)' : '#94A3B8',
        marginBottom: '20px',
        cursor: 'pointer',
        background: hasFile ? '#F0FDF4' : '#F8FAFC',
        transition: 'all 0.2s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    });

    return (
        <>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-brand)', fontWeight: '800', letterSpacing: '-0.5px' }}>Broker Verification</h1>
                <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '15px' }}>Upload your documents to get verified and start listing properties.</p>
            </div>

            {/* Verification Status Card */}
            {fetchingStatus ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner"></div>
                </div>
            ) : verificationStatus ? (
                <div style={{
                    background: 'white',
                    padding: '32px',
                    borderRadius: '24px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    border: '1px solid #E2E8F0',
                    maxWidth: '700px',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <span className="material-icons-round" style={{
                            fontSize: '48px',
                            color: verificationStatus.status === 'approved' ? 'var(--color-success)' :
                                verificationStatus.status === 'rejected' ? '#EF4444' : '#F59E0B'
                        }}>
                            {verificationStatus.status === 'approved' ? 'verified' :
                                verificationStatus.status === 'rejected' ? 'cancel' : 'schedule'}
                        </span>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>
                                {verificationStatus.status === 'approved' ? 'Verification Approved!' :
                                    verificationStatus.status === 'rejected' ? 'Verification Rejected' : 'Verification Pending'}
                            </h2>
                            <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px' }}>
                                {verificationStatus.status === 'approved' ? 'You are now a verified host' :
                                    verificationStatus.status === 'rejected' ? 'Please review the feedback and resubmit' : 'Your documents are under review'}
                            </p>
                        </div>
                    </div>

                    {verificationStatus.status === 'rejected' && verificationStatus.rejectionReason && (
                        <div style={{
                            background: '#FEE2E2',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #FCA5A5',
                            marginTop: '16px'
                        }}>
                            <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#991B1B' }}>
                                Rejection Reason
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#991B1B' }}>
                                {verificationStatus.rejectionReason}
                            </p>
                        </div>
                    )}

                    {verificationStatus.status === 'approved' && (
                        <div style={{
                            background: '#D1FAE5',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #6EE7B7',
                            marginTop: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '24px', color: '#065F46' }}>
                                verified_user
                            </span>
                            <p style={{ margin: 0, fontSize: '14px', color: '#065F46', fontWeight: '600' }}>
                                You now have the "Verified Host" badge on all your listings
                            </p>
                        </div>
                    )}

                    {verificationStatus.status !== 'approved' && (
                        <button
                            onClick={() => setVerificationStatus(null)}
                            style={{
                                marginTop: '16px',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--color-brand)',
                                color: 'white',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            {verificationStatus.status === 'rejected' ? 'Resubmit Documents' : 'Update Documents'}
                        </button>
                    )}
                </div>
            ) : null}

            {/* Upload Form - Only show if no verification or rejected */}
            {(!verificationStatus || verificationStatus.status === 'rejected') && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', maxWidth: '700px' }}>

                    <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>1. Government Issued ID</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>

                        {/* Front ID */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '8px' }}>Front of ID</label>
                            <div style={dropzoneStyle(!!files.front)} onClick={() => document.getElementById('front-id').click()}>
                                {files.front ? (
                                    <>
                                        <span className="material-icons-round" style={{ fontSize: '32px' }}>check_circle</span>
                                        <span style={{ fontSize: '12px', fontWeight: '700' }}>Ready to Upload</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-round" style={{ fontSize: '32px' }}>add_photo_alternate</span>
                                        <span style={{ fontSize: '12px', fontWeight: '700' }}>Click to Upload</span>
                                    </>
                                )}
                                <input type="file" id="front-id" hidden onChange={(e) => handleFileChange(e, 'front')} accept="image/*" />
                            </div>
                        </div>

                        {/* Back ID */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '8px' }}>Back of ID</label>
                            <div style={dropzoneStyle(!!files.back)} onClick={() => document.getElementById('back-id').click()}>
                                {files.back ? (
                                    <>
                                        <span className="material-icons-round" style={{ fontSize: '32px' }}>check_circle</span>
                                        <span style={{ fontSize: '12px', fontWeight: '700' }}>Ready to Upload</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-round" style={{ fontSize: '32px' }}>add_photo_alternate</span>
                                        <span style={{ fontSize: '12px', fontWeight: '700' }}>Click to Upload</span>
                                    </>
                                )}
                                <input type="file" id="back-id" hidden onChange={(e) => handleFileChange(e, 'back')} accept="image/*" />
                            </div>
                        </div>
                    </div>

                    <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>2. Proof of Address</h3>
                    <div style={dropzoneStyle(!!files.address)} onClick={() => document.getElementById('proof-address').click()}>
                        {files.address ? (
                            <>
                                <span className="material-icons-round" style={{ fontSize: '32px' }}>history_edu</span>
                                <span style={{ fontSize: '13px', fontWeight: '700' }}>{files.address.name}</span>
                            </>
                        ) : (
                            <>
                                <span className="material-icons-round" style={{ fontSize: '32px' }}>file_present</span>
                                <span style={{ fontSize: '13px', fontWeight: '700' }}>Upload Utility Bill or Bank Statement</span>
                            </>
                        )}
                        <input type="file" id="proof-address" hidden onChange={(e) => handleFileChange(e, 'address')} accept="image/*" />
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-small" style={{ borderTopColor: 'white' }}></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-round">verified</span>
                                    Submit Documents for Review
                                </>
                            )}
                        </button>
                        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', marginTop: '16px', fontWeight: '600' }}>
                            <span className="material-icons-round" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>lock</span>
                            Your data is encrypted and stored securely
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Verification;
