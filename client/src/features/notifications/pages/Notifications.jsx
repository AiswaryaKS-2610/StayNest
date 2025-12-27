import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();

    const notifications = [
        { id: 1, type: 'success', title: 'Viewing Confirmed', message: 'Your viewing for "Modern Studio near Trinity" is scheduled for Thu, 12th Oct at 14:00.', time: '2 hours ago', read: false },
        { id: 2, type: 'info', title: 'New Message', message: 'Conor O\'Brien replied to your enquiry.', time: '5 hours ago', read: true },
        { id: 3, type: 'warning', title: 'Profile Incomplete', message: 'Please upload your student ID to verify your status.', time: '1 day ago', read: true }
    ];

    return (
        <div style={{ padding: '16px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none' }}><span className="material-icons-round">arrow_back</span></button>
                <h1 style={{ fontSize: '24px', margin: 0 }}>Notifications</h1>
            </div>

            <div>
                {notifications.map(note => (
                    <div key={note.id} style={{
                        background: note.read ? 'white' : '#F0F9FF',
                        border: '1px solid #eee',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        display: 'flex',
                        gap: '12px',
                        borderLeft: `4px solid ${note.type === 'success' ? '#10B981' : note.type === 'warning' ? '#F59E0B' : '#3B82F6'}`
                    }}>
                        <div style={{
                            background: note.type === 'success' ? '#D1FAE5' : note.type === 'warning' ? '#FEF3C7' : '#DBEAFE',
                            width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <span className="material-icons-round" style={{
                                color: note.type === 'success' ? '#047857' : note.type === 'warning' ? '#B45309' : '#1D4ED8',
                                fontSize: '20px'
                            }}>
                                {note.type === 'success' ? 'check_circle' : note.type === 'warning' ? 'warning' : 'info'}
                            </span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>{note.title}</h4>
                                <span style={{ fontSize: '12px', color: '#999' }}>{note.time}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.4' }}>{note.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
