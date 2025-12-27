import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('tenant');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            if (role === 'tenant') {
                navigate('/tenant/dashboard');
            } else {
                navigate('/broker/dashboard'); // Or verification if not verified
            }
        } catch (error) {
            alert('Login Failed (Mock): Use any email');
            // Fallback for demo
            if (role === 'tenant') navigate('/tenant/dashboard');
            else navigate('/broker/dashboard');
        }
    };

    return (
        <div style={{ padding: '24px', textAlign: 'center', marginTop: '40px' }}>
            <h1 style={{ color: 'var(--color-primary)', fontSize: '32px' }}>StayNest</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Find your home in Ireland</p>

            <div style={{ marginTop: '32px' }}>
                <div
                    onClick={() => setRole('tenant')}
                    style={{
                        padding: '16px',
                        border: role === 'tenant' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        background: role === 'tenant' ? 'var(--color-primary-light)' : 'white'
                    }}
                >
                    <h3>Tenant / Student</h3>
                </div>

                <div
                    onClick={() => setRole('broker')}
                    style={{
                        padding: '16px',
                        border: role === 'broker' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        background: role === 'broker' ? 'var(--color-primary-light)' : 'white'
                    }}
                >
                    <h3>Broker / Partner</h3>
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn-primary" type="submit">
                        Continue as {role === 'tenant' ? 'Student' : 'Broker'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
