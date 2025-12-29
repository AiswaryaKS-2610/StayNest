import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); 
    const [role, setRole] = useState('tenant');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(email, password, role, fullName);
            setStep(2);
        } catch (error) {
            alert(error.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mesh-gradient" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {}
            <div className="aura-bg" style={{ width: '400px', height: '400px', background: '#22C55E', top: '-100px', right: '-100px', opacity: 0.15 }}></div>
            <div className="aura-bg" style={{ width: '350px', height: '350px', background: '#1E3A8A', bottom: '-50px', left: '-50px', opacity: 0.1, animationDelay: '1.5s' }}></div>

            <div className="glass-morphism animate-in" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '40px 32px',
                borderRadius: '32px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                {step === 1 ? (
                    <>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{
                                display: 'inline-flex',
                                background: 'linear-gradient(135deg, #22C55E, #10B981)',
                                padding: '16px',
                                borderRadius: '24px',
                                marginBottom: '20px',
                                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)'
                            }}>
                                <span className="material-icons-round" style={{ color: 'white', fontSize: '32px' }}>home</span>
                            </div>
                            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px', color: 'var(--color-text-pri)', letterSpacing: '-1px' }}>Join StayNest</h1>
                            <p style={{ color: 'var(--color-text-sec)', fontSize: '15px', fontWeight: '500' }}>Your premium stay starts here</p>
                        </div>

                        {}
                        <div style={{
                            display: 'flex',
                            background: '#F1F5F9',
                            padding: '4px',
                            borderRadius: '16px',
                            marginBottom: '28px',
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
                                        color: role === r ? 'var(--color-success)' : 'var(--color-text-sec)',
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

                        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginLeft: '4px' }}>
                                    <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-success)' }}>badge</span>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-pri)' }}>Full Name</label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="eg Aiswarya KS"
                                    className="input-field input-glow"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginLeft: '4px' }}>
                                    <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-success)' }}>mail_outline</span>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-pri)' }}>Email Address</label>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="input-field input-glow"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginLeft: '4px' }}>
                                    <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--color-success)' }}>lock_open</span>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-pri)' }}>Create Password</label>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="input-field input-glow"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: '56px', borderRadius: '16px', background: 'var(--color-success)' }}>
                                {loading ? <div className="spinner-small" style={{ borderTopColor: 'white' }}></div> : 'Create Account'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ py: '20px' }}>
                        <div style={{
                            display: 'inline-flex',
                            background: '#F0FDF4',
                            padding: '24px',
                            borderRadius: '32px',
                            marginBottom: '24px',
                            color: 'var(--color-success)'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: '64px' }}>mark_email_read</span>
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: 'var(--color-text-pri)' }}>Check your mail</h2>
                        <p style={{ color: 'var(--color-text-sec)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                            We've sent a verification link to<br />
                            <strong style={{ color: 'var(--color-text-pri)' }}>{email}</strong>
                        </p>

                        <div style={{
                            background: '#F8FAFC',
                            padding: '20px',
                            borderRadius: '20px',
                            marginBottom: '32px',
                            border: '1px dashed #E2E8F0',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <span className="material-icons-round" style={{ color: 'var(--color-brand)', fontSize: '20px' }}>info</span>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-sec)', fontWeight: '500' }}>
                                    If you don't see it in a few minutes, please check your spam folder.
                                </p>
                            </div>
                        </div>

                        <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', height: '56px', borderRadius: '16px' }}>
                            Back to Login
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '32px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-sec)', fontWeight: '600', margin: 0 }}>
                        Already a member? <Link to="/login" style={{ color: 'var(--color-success)', fontWeight: '800', textDecoration: 'none' }}>Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
