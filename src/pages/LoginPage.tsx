// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Mail, Phone, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginForm {
    email: string;
    password: string;
}

interface RegisterForm {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export default function LoginPage() {
    const { login, register: registerUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const loginForm = useForm<LoginForm>();
    const registerForm = useForm<RegisterForm>();

    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
    }

    const onLogin = async (data: LoginForm) => {
        setApiError(null);
        try {
            await login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    const onRegister = async (data: RegisterForm) => {
        setApiError(null);
        try {
            await registerUser(data.name, data.email, data.phone, data.password);
            navigate(from, { replace: true });
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    const inputStyle = { paddingLeft: '2.5rem' };
    const iconStyle: React.CSSProperties = {
        position: 'absolute', left: '0.9rem', top: '50%',
        transform: 'translateY(-50%)', color: '#475569',
    };
    const fieldWrap = { marginBottom: '1rem' };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.85rem', fontWeight: 600,
        color: '#94a3b8', marginBottom: '0.4rem',
    };
    const errorStyle: React.CSSProperties = {
        color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', marginBottom: 0,
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '1.5rem',
        }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'linear-gradient(135deg, #22c55e, #10b981)',
                        borderRadius: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
                    }}>
                        <Zap size={32} color="white" fill="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                        EV<span style={{ color: '#22c55e' }}>Charge</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {mode === 'login' ? 'Sign in to book your charging slot' : 'Create your account to get started'}
                    </p>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    {/* Tabs */}
                    <div style={{
                        display: 'flex', background: '#1e293b',
                        borderRadius: '0.75rem', padding: '4px', marginBottom: '1.5rem',
                    }}>
                        {(['login', 'register'] as const).map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => { setMode(tab); setApiError(null); }}
                                style={{
                                    flex: 1, padding: '0.6rem',
                                    borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
                                    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                                    background: mode === tab ? 'linear-gradient(135deg, #22c55e, #10b981)' : 'transparent',
                                    color: mode === tab ? 'white' : '#64748b',
                                    boxShadow: mode === tab ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
                                }}
                            >
                                {tab === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        ))}
                    </div>

                    {/* Redirect notice */}
                    {from !== '/' && (
                        <div style={{
                            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                            borderRadius: '0.75rem', padding: '0.75rem 1rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            marginBottom: '1.25rem', fontSize: '0.85rem', color: '#fbbf24',
                        }}>
                            <AlertCircle size={16} />
                            Please login to continue your booking
                        </div>
                    )}

                    {/* API error */}
                    {apiError && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '0.75rem', padding: '0.75rem 1rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            marginBottom: '1.25rem', fontSize: '0.85rem', color: '#f87171',
                        }}>
                            <AlertCircle size={16} />
                            {apiError}
                        </div>
                    )}

                    {/* LOGIN FORM */}
                    {mode === 'login' && (
                        <form onSubmit={loginForm.handleSubmit(onLogin)} noValidate>
                            <div style={fieldWrap}>
                                <label htmlFor="login-email" style={labelStyle}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={iconStyle} />
                                    <input
                                        id="login-email" type="email" autoComplete="email"
                                        placeholder="arjun@example.com"
                                        className="input-field" style={inputStyle}
                                        {...loginForm.register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                                        })}
                                    />
                                </div>
                                {loginForm.formState.errors.email && <p style={errorStyle}>{loginForm.formState.errors.email.message}</p>}
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="login-password" style={labelStyle}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={iconStyle} />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        {...loginForm.register('password', { required: 'Password is required' })}
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                                        position: 'absolute', right: '0.9rem', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: '#475569', padding: 0,
                                    }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {loginForm.formState.errors.password && <p style={errorStyle}>{loginForm.formState.errors.password.message}</p>}
                            </div>

                            <button
                                type="submit" className="btn-primary"
                                style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
                                disabled={loginForm.formState.isSubmitting}
                            >
                                {loginForm.formState.isSubmitting ? (
                                    <><span style={{ width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }} /> Signing in...</>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    )}

                    {/* REGISTER FORM */}
                    {mode === 'register' && (
                        <form onSubmit={registerForm.handleSubmit(onRegister)} noValidate>
                            <div style={fieldWrap}>
                                <label htmlFor="reg-name" style={labelStyle}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={iconStyle} />
                                    <input
                                        id="reg-name" type="text" autoComplete="name"
                                        placeholder="Arjun Sharma"
                                        className="input-field" style={inputStyle}
                                        {...registerForm.register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                                    />
                                </div>
                                {registerForm.formState.errors.name && <p style={errorStyle}>{registerForm.formState.errors.name.message}</p>}
                            </div>

                            <div style={fieldWrap}>
                                <label htmlFor="reg-email" style={labelStyle}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={iconStyle} />
                                    <input
                                        id="reg-email" type="email" autoComplete="email"
                                        placeholder="arjun@example.com"
                                        className="input-field" style={inputStyle}
                                        {...registerForm.register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                                        })}
                                    />
                                </div>
                                {registerForm.formState.errors.email && <p style={errorStyle}>{registerForm.formState.errors.email.message}</p>}
                            </div>

                            <div style={fieldWrap}>
                                <label htmlFor="reg-phone" style={labelStyle}>Phone</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={iconStyle} />
                                    <input
                                        id="reg-phone" type="tel" autoComplete="tel"
                                        placeholder="+91 98765 43210"
                                        className="input-field" style={inputStyle}
                                        {...registerForm.register('phone', {
                                            required: 'Phone is required',
                                            pattern: { value: /^[+]?[\d\s\-]{10,}$/, message: 'Enter a valid phone number' },
                                        })}
                                    />
                                </div>
                                {registerForm.formState.errors.phone && <p style={errorStyle}>{registerForm.formState.errors.phone.message}</p>}
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="reg-password" style={labelStyle}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={iconStyle} />
                                    <input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Min. 6 characters"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        {...registerForm.register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                        })}
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                                        position: 'absolute', right: '0.9rem', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: '#475569', padding: 0,
                                    }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {registerForm.formState.errors.password && <p style={errorStyle}>{registerForm.formState.errors.password.message}</p>}
                            </div>

                            <button
                                type="submit" className="btn-primary"
                                style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
                                disabled={registerForm.formState.isSubmitting}
                            >
                                {registerForm.formState.isSubmitting ? (
                                    <><span style={{ width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }} /> Creating account...</>
                                ) : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
