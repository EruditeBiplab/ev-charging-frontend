// src/pages/ForgotPasswordPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, KeyRound, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';

type Step = 'email' | 'otp';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [demoOtp, setDemoOtp] = useState('');         // shown only in demo mode
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    /* ─── Step 1: Request OTP ─── */
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Please enter your email address.'); return; }
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(email.trim())) { setError('Please enter a valid email address.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json() as { message: string; demo_otp?: string };
            if (data.demo_otp) setDemoOtp(data.demo_otp);
            setStep('otp');
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ─── Step 2: Verify OTP & Reset Password ─── */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.trim().length !== 6) { setError('Please enter the 6-digit code.'); return; }
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword }),
            });
            const data = await res.json() as { message?: string; error?: string };
            if (!res.ok) {
                setError(data.error ?? 'Reset failed. Please try again.');
                return;
            }
            setSuccess(data.message ?? 'Password reset successfully!');
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ─── Success screen ─── */
    if (success) {
        return (
            <div style={pageWrap}>
                <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
                    <div style={logoBox}><Zap size={32} color="white" fill="white" /></div>
                    <div style={{ ...card, padding: '2.5rem 2rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <CheckCircle size={32} color="#22c55e" />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                            Password Reset!
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                            Your password has been updated successfully. You can now sign in with your new password.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                            style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
                        >
                            Go to Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={pageWrap}>
            <div style={{ width: '100%', maxWidth: '440px' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={logoBox}><Zap size={32} color="white" fill="white" /></div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                        EV<span style={{ color: '#22c55e' }}>Charge</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {step === 'email' ? 'Reset your account password' : 'Enter the code and set a new password'}
                    </p>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {(['email', 'otp'] as Step[]).map((s, idx) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700,
                                background: step === s ? 'linear-gradient(135deg,#22c55e,#10b981)' : (idx === 0 && step === 'otp') ? 'rgba(34,197,94,0.2)' : '#1e293b',
                                color: step === s ? 'white' : (idx === 0 && step === 'otp') ? '#22c55e' : '#475569',
                                border: step !== s && !(idx === 0 && step === 'otp') ? '1px solid #334155' : 'none',
                                boxShadow: step === s ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
                            }}>
                                {idx === 0 && step === 'otp' ? <CheckCircle size={14} /> : idx + 1}
                            </div>
                            {idx < 1 && <div style={{ width: '40px', height: '2px', background: step === 'otp' ? '#22c55e' : '#1e293b', borderRadius: '2px', transition: 'background 0.3s' }} />}
                        </div>
                    ))}
                    <span style={{ marginLeft: '0.25rem', fontSize: '0.78rem', color: '#64748b' }}>
                        {step === 'email' ? 'Step 1 of 2' : 'Step 2 of 2'}
                    </span>
                </div>

                {/* Card */}
                <div style={card}>

                    {/* Error */}
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#f87171' }}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    {/* ── STEP 1: Email ── */}
                    {step === 'email' && (
                        <form onSubmit={handleRequestOtp} noValidate>
                            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                Enter the email address linked to your account and we'll send you a 6-digit reset code.
                            </p>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="fp-email" style={labelStyle}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={iconStyle} />
                                    <input
                                        id="fp-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="arjun@example.com"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(''); }}
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', fontSize: '1rem', padding: '0.9rem', marginBottom: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span style={spinStyle} /> Sending Code...</>
                                ) : (
                                    <><KeyRound size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Send Reset Code</>
                                )}
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                <Link to="/login" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <ArrowLeft size={14} /> Back to Sign In
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 2: OTP + New Password ── */}
                    {step === 'otp' && (
                        <form onSubmit={handleResetPassword} noValidate>

                            {/* Demo OTP banner */}
                            {demoOtp && (
                                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '0.9rem', padding: '0.9rem 1.1rem', marginBottom: '1.25rem' }}>
                                    <p style={{ color: '#fbbf24', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.35rem' }}>
                                        ⚠ Demo Mode — Reset Code
                                    </p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                                        In production, this code would be emailed to <strong style={{ color: '#f1f5f9' }}>{email}</strong>. For demo purposes, here it is:
                                    </p>
                                    <div style={{ textAlign: 'center', letterSpacing: '0.35em', fontSize: '2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace', padding: '0.25rem 0' }}>
                                        {demoOtp}
                                    </div>
                                </div>
                            )}

                            {/* OTP input */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="fp-otp" style={labelStyle}>6-Digit Reset Code</label>
                                <div style={{ position: 'relative' }}>
                                    <KeyRound size={16} style={iconStyle} />
                                    <input
                                        id="fp-otp"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="• • • • • •"
                                        value={otp}
                                        onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem', letterSpacing: '0.3em', fontWeight: 700, fontSize: '1.1rem' }}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* New password */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="fp-newpw" style={labelStyle}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={iconStyle} />
                                    <input
                                        id="fp-newpw"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Min. 6 characters"
                                        value={newPassword}
                                        onChange={e => { setNewPassword(e.target.value); setError(''); }}
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} style={eyeBtn}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="fp-confirmpw" style={labelStyle}>Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={iconStyle} />
                                    <input
                                        id="fp-confirmpw"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem',
                                            borderColor: confirmPassword && newPassword !== confirmPassword ? 'rgba(239,68,68,0.6)' : undefined,
                                        }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} style={eyeBtn}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', fontSize: '1rem', padding: '0.9rem', marginBottom: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span style={spinStyle} /> Resetting Password...</>
                                ) : (
                                    <><CheckCircle size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Reset Password</>
                                )}
                            </button>

                            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => { setStep('email'); setError(''); setOtp(''); setDemoOtp(''); setNewPassword(''); setConfirmPassword(''); }}
                                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                    <RefreshCw size={13} /> Resend code
                                </button>
                                <Link to="/login" style={{ color: '#64748b', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <ArrowLeft size={13} /> Back to Sign In
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}

/* ─── Shared styles ─── */
const pageWrap: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '1.5rem',
};
const logoBox: React.CSSProperties = {
    width: '64px', height: '64px',
    background: 'linear-gradient(135deg, #22c55e, #10b981)',
    borderRadius: '18px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1rem',
    boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
};
const card: React.CSSProperties = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '1.25rem',
    padding: '2rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600,
    color: '#94a3b8', marginBottom: '0.4rem',
};
const iconStyle: React.CSSProperties = {
    position: 'absolute', left: '0.9rem', top: '50%',
    transform: 'translateY(-50%)', color: '#475569',
};
const eyeBtn: React.CSSProperties = {
    position: 'absolute', right: '0.9rem', top: '50%',
    transform: 'translateY(-50%)', background: 'none',
    border: 'none', cursor: 'pointer', color: '#475569', padding: 0,
};
const spinStyle: React.CSSProperties = {
    width: '16px', height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white', borderRadius: '50%',
    display: 'inline-block', verticalAlign: 'middle',
    animation: 'spin 0.7s linear infinite', marginRight: '0.5rem',
};
