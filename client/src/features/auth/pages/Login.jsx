import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('tenant');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginUser(email, password);
            if (role === 'tenant') {
                navigate('/tenant/dashboard');
            } else {
                navigate('/broker/dashboard');
            }
        } catch (error) {
            alert(error.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mesh-gradient" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* Background Aura Elements */}
            <div className="aura-bg" style={{ width: '400px', height: '400px', background: '#1E3A8A', top: '-100px', left: '-100px', opacity: 0.15 }}></div>
            <div className="aura-bg" style={{ width: '300px', height: '300px', background: '#22C55E', bottom: '-50px', right: '-50px', opacity: 0.1, animationDelay: '2s' }}></div>

            <div className="glass-morphism animate-in" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px 32px',
                borderRadius: '32px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex',
                        background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                        padding: '16px',
                        borderRadius: '24px',
                        marginBottom: '20px',
                        boxShadow: '0 8px 24px rgba(30, 58, 138, 0.2)'
                    }}>
                        <span className="material-icons-round" style={{ color: 'white', fontSize: '32px' }}>home</span>
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px', color: 'var(--color-text-pri)', letterSpacing: '-1px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-sec)', fontSize: '15px', fontWeight: '500' }}>Login to your premium stay experience</p>
                </div>

                {/* Role Switcher */}
                <div style={{
                    display: 'flex',
                    background: '#F1F5F9',
                    padding: '4px',
                    borderRadius: '16px',
                    marginBottom: '32px',
                    position: 'relative'
                }}>
                    {['tenant', 'broker'].map((r) => (
                        <div
                            key={r}
                            onClick={() => setRole(r)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                zIndex: 2,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                color: role === r ? 'var(--color-brand)' : 'var(--color-text-sec)',
                                fontWeight: '700',
                                fontSize: '14px'
                            }}
                        >
                            {r === 'tenant' ? 'Student' : 'Broker'}
                        </div>
                    ))}
                    <div style={{
                        position: 'absolute',
                        top: '4px',
                        bottom: '4px',
                        left: role === 'tenant' ? '4px' : '50%',
                        width: 'calc(50% - 4px)',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
                        zIndex: 1
                    }}></div>
                </div>

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginLeft: '4px' }}>
                            <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-brand)' }}>alternate_email</span>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-pri)' }}>Email Address</label>
                        </div>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="input-field input-glow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginLeft: '4px' }}>
                            <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-brand)' }}>lock_open</span>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-pri)' }}>Password</label>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-field input-glow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: '56px', borderRadius: '16px' }}>
                        {loading ? <div className="spinner-small" style={{ borderTopColor: 'white' }}></div> : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-sec)', fontWeight: '600', margin: 0 }}>
                            New to StayNest? <span style={{ color: 'var(--color-brand)', fontWeight: '800' }}>Create an account</span>
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
