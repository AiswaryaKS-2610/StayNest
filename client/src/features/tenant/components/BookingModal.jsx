import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose, propertyTitle }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Viewing requested for ${date} at ${time}. The broker will confirm shortly!`);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '350px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Request Viewing</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px' }}>&times;</button>
                </div>

                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                    Schedule a visit for <strong>{propertyTitle}</strong>.
                </p>

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>Date</label>
                    <input
                        type="date"
                        required
                        className="input-field"
                        onChange={(e) => setDate(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />

                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>Time</label>
                    <input
                        type="time"
                        required
                        className="input-field"
                        onChange={(e) => setTime(e.target.value)}
                        style={{ marginBottom: '24px' }}
                    />

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Send Request
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#666' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
