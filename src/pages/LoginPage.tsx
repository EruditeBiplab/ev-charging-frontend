// src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Mail, Phone, AlertCircle } from 'lucide-react';

interface LoginForm {
    name: string;
    email: string;
    phone: string;
}

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>();

    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
    }

    const onSubmit = async (data: LoginForm) => {
        await new Promise(r => setTimeout(r, 800));
        login(data.name, data.email, data.phone);
        navigate(from, { replace: true });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '1.5rem',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
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
                        Sign in to book your charging slot
                    </p>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', marginTop: 0 }}>
                        Welcome Back
                    </h2>

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

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Name */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="login-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    id="login-name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Arjun Sharma"
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                                />
                            </div>
                            {errors.name && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', marginBottom: 0 }}>{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                                Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="arjun@example.com"
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                                    })}
                                />
                            </div>
                            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', marginBottom: 0 }}>{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="login-phone" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                                Phone
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    id="login-phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="+91 98765 43210"
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    {...register('phone', {
                                        required: 'Phone is required',
                                        pattern: { value: /^[+]?[\d\s\-]{10,}$/, message: 'Enter a valid phone number' },
                                    })}
                                />
                            </div>
                            {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', marginBottom: 0 }}>{errors.phone.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span style={{
                                        width: '16px', height: '16px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        animation: 'spin 0.7s linear infinite',
                                    }} />
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#475569', marginTop: '1rem', marginBottom: 0 }}>
                        No account needed — just fill in your details to continue
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
