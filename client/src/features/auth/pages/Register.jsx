import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('tenant');

    const handleRegister = (e) => {
        e.preventDefault();
        // Mock Register
        alert("Registration Successful! Please log in.");
        navigate('/login');
    };

    return (
        <div style={{ padding: '24px', textAlign: 'center', marginTop: '40px' }}>
            <h1 style={{ color: 'var(--color-primary)', fontSize: '32px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Join StayNest today</p>

            <div style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button
                        onClick={() => setRole('tenant')}
                        className={role === 'tenant' ? 'btn-primary' : ''}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: role === 'tenant' ? 'none' : '1px solid #ddd',
                            background: role === 'tenant' ? 'var(--color-primary)' : 'white',
                            color: role === 'tenant' ? 'white' : '#666'
                        }}
                    >
                        Student
                    </button>
                    <button
                        onClick={() => setRole('broker')}
                        className={role === 'broker' ? 'btn-primary' : ''}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: role === 'broker' ? 'none' : '1px solid #ddd',
                            background: role === 'broker' ? 'var(--color-primary)' : 'white',
                            color: role === 'broker' ? 'white' : '#666'
                        }}
                    >
                        Broker
                    </button>
                </div>

                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Full Name" className="input-field" required />
                    <input type="email" placeholder="Email" className="input-field" required />
                    <input type="password" placeholder="Password" className="input-field" required />
                    <input type="password" placeholder="Confirm Password" className="input-field" required />

                    <button className="btn-primary" type="submit">
                        Sign Up as {role === 'tenant' ? 'Student' : 'Broker'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
