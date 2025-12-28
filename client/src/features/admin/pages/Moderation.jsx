import React from 'react';

const Moderation = () => {
    return (
        <div style={{ padding: '24px' }}>
            <h1>Admin Dashboard</h1>
            <p>Verify brokers and listings to ensure safety.</p>

            <div style={{ marginTop: '24px' }}>
                <h3>Pending Verifications (3)</h3>

                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        background: 'white', padding: '16px', borderRadius: '12px',
                        border: '1px solid #eee', marginBottom: '12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <h4 style={{ margin: 0 }}>Name (Broker)</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>ID Uploaded: Passport</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>Reject</button>
                            <button style={{ background: '#dcfce7', color: 'var(--color-primary-dark)', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>Approve</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Moderation;
