import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase.config';

const AdminVerifications = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedVerification, setSelectedVerification] = useState(null);

    useEffect(() => {
        fetchVerifications();
    }, [filter]);

    const fetchVerifications = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in first');
                return;
            }

            const token = await user.getIdToken();
            console.log('Fetching verifications with token:', token.substring(0, 20) + '...');

            const response = await fetch(`https://staynest-6vsv.onrender.com/api/verifications?status=${filter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch verifications: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Fetched verifications:', data);
            setVerifications(data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
            alert(`Failed to load verifications: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve this broker?')) return;

        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();

            const response = await fetch(`https://staynest-6vsv.onrender.com/api/verifications/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to approve verification');

            alert('Broker approved successfully!');
            setSelectedVerification(null);
            fetchVerifications();
        } catch (error) {
            console.error('Error approving verification:', error);
            alert('Failed to approve verification');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();

            const response = await fetch(`https://staynest-6vsv.onrender.com/api/verifications/${id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) throw new Error('Failed to reject verification');

            alert('Verification rejected');
            setSelectedVerification(null);
            fetchVerifications();
        } catch (error) {
            console.error('Error rejecting verification:', error);
            alert('Failed to reject verification');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#FEF3C7', color: '#92400E', icon: 'schedule' },
            approved: { bg: '#D1FAE5', color: '#065F46', icon: 'check_circle' },
            rejected: { bg: '#FEE2E2', color: '#991B1B', icon: 'cancel' }
        };
        const s = styles[status] || styles.pending;

        return (
            <div style={{
                background: s.bg,
                color: s.color,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textTransform: 'uppercase'
            }}>
                <span className="material-icons-round" style={{ fontSize: '16px' }}>{s.icon}</span>
                {status}
            </div>
        );
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-brand)', fontWeight: '800' }}>
                    Broker Verifications
                </h1>
                <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '15px' }}>
                    Review and manage broker verification requests
                </p>
            </div>

            {}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                borderBottom: '2px solid #E2E8F0',
                paddingBottom: '8px'
            }}>
                {['pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: filter === status ? 'var(--color-brand)' : 'transparent',
                            color: filter === status ? 'white' : '#64748B',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            ) : verifications.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0'
                }}>
                    <span className="material-icons-round" style={{ fontSize: '64px', color: '#CBD5E1' }}>
                        inbox
                    </span>
                    <p style={{ color: '#64748B', marginTop: '16px', fontSize: '15px' }}>
                        No {filter} verifications found
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {verifications.map(verification => (
                        <div
                            key={verification.id}
                            className="premium-card"
                            style={{ padding: '24px', cursor: 'pointer' }}
                            onClick={() => setSelectedVerification(verification)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--color-text-pri)' }}>
                                        {verification.brokerName}
                                    </h3>
                                    <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px' }}>
                                        {verification.brokerEmail}
                                    </p>
                                    <p style={{ margin: '8px 0 0', color: '#94A3B8', fontSize: '13px' }}>
                                        Submitted: {new Date(verification.submittedAt?._seconds * 1000 || verification.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    {getStatusBadge(verification.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {}
            {selectedVerification && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setSelectedVerification(null)}>
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '32px',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>
                                Verification Details
                            </h2>
                            <button
                                onClick={() => setSelectedVerification(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px'
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '24px', color: '#64748B' }}>
                                    close
                                </span>
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#64748B' }}>Broker Name</p>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{selectedVerification.brokerName}</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#64748B' }}>Email</p>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{selectedVerification.brokerEmail}</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#64748B' }}>Government ID</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Front</p>
                                    <img
                                        src={selectedVerification.idFront}
                                        alt="ID Front"
                                        style={{ width: '100%', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Back</p>
                                    <img
                                        src={selectedVerification.idBack}
                                        alt="ID Back"
                                        style={{ width: '100%', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#64748B' }}>Proof of Address</p>
                            <img
                                src={selectedVerification.proofOfAddress}
                                alt="Proof of Address"
                                style={{ width: '100%', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                            />
                        </div>

                        {selectedVerification.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => handleApprove(selectedVerification.id)}
                                    className="btn-primary"
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'var(--color-success)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span className="material-icons-round">check_circle</span>
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(selectedVerification.id)}
                                    className="btn-primary"
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: '#EF4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span className="material-icons-round">cancel</span>
                                    Reject
                                </button>
                            </div>
                        )}

                        {selectedVerification.status === 'rejected' && selectedVerification.rejectionReason && (
                            <div style={{
                                background: '#FEE2E2',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid #FCA5A5'
                            }}>
                                <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#991B1B' }}>
                                    Rejection Reason
                                </p>
                                <p style={{ margin: 0, fontSize: '14px', color: '#991B1B' }}>
                                    {selectedVerification.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerifications;
