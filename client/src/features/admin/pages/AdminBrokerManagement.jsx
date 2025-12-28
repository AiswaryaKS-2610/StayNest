import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase.config';

const AdminBrokerManagement = () => {
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBrokers = async () => {
        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const res = await fetch('http://localhost:5000/api/admin/brokers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBrokers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrokers();
    }, []);



    const toggleBlock = async (id, currentBlocked) => {
        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const res = await fetch(`http://localhost:5000/api/admin/users/${id}/block`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ block: !currentBlocked })
            });
            if (res.ok) {
                setBrokers(brokers.map(b => b.id === id ? { ...b, isBlocked: !currentBlocked } : b));
            }
        } catch (err) {
            alert("Action failed");
        }
    };

    const [showDocs, setShowDocs] = useState(null);

    if (loading) return <div className="spinner-small" style={{ margin: '100px auto' }}></div>;

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '32px' }}>Broker Management</h1>

            {showDocs && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Verification Documents</h2>
                            <button onClick={() => setShowDocs(null)} className="material-icons-round" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>close</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div>
                                <p style={{ fontWeight: '800', fontSize: '13px' }}>Front ID</p>
                                <img src={showDocs.idDocuments?.front} style={{ width: '100%', borderRadius: '12px' }} />
                            </div>
                            <div>
                                <p style={{ fontWeight: '800', fontSize: '13px' }}>Back ID</p>
                                <img src={showDocs.idDocuments?.back} style={{ width: '100%', borderRadius: '12px' }} />
                            </div>
                            <div>
                                <p style={{ fontWeight: '800', fontSize: '13px' }}>Address</p>
                                <img src={showDocs.addressDocument} style={{ width: '100%', borderRadius: '12px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F8FAFC' }}>
                        <tr>
                            <th style={thStyle}>Broker Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brokers.map(broker => (
                            <tr key={broker.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '700' }}>{broker.fullName || 'Anonymous'}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>ID: {broker.id.slice(0, 8)}...</div>
                                </td>
                                <td style={tdStyle}>{broker.email}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {broker.verified ? (
                                            <span style={{ ...tagStyle, background: '#10B98115', color: '#10B981' }}>Verified</span>
                                        ) : (
                                            <span style={{ ...tagStyle, background: '#F59E0B15', color: '#F59E0B' }}>Unverified</span>
                                        )}
                                        {broker.isBlocked && (
                                            <span style={{ ...tagStyle, background: '#EF444415', color: '#EF4444' }}>Blocked</span>
                                        )}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setShowDocs(broker)} style={{ ...smallBtnStyle, color: 'var(--color-brand)' }}>View Docs</button>
                                        {!broker.verified && (
                                            <button onClick={() => verifyBroker(broker.id)} style={smallBtnStyle}>Verify</button>
                                        )}
                                        <button
                                            onClick={() => toggleBlock(broker.id, broker.isBlocked)}
                                            style={{ ...smallBtnStyle, color: broker.isBlocked ? '#10B981' : '#EF4444' }}
                                        >
                                            {broker.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const verifyBroker = async (id) => {
    try {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const res = await fetch(`http://localhost:5000/api/admin/brokers/${id}/verify`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setBrokers(brokers.map(b => b.id === id ? { ...b, verified: true } : b));
            alert("Broker Verified!");
        }
    } catch (err) {
        alert("Verification failed");
    }
};

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
};
const modalStyle = {
    background: 'white', padding: '32px', borderRadius: '24px',
    maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
};

const thStyle = { padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#64748B' };
const tdStyle = { padding: '20px 24px', fontSize: '14px' };
const tagStyle = { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' };
const smallBtnStyle = {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    background: 'white',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer'
};

export default AdminBrokerManagement;
