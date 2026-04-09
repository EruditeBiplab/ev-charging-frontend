// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit3, Check, X, LogOut, BookOpen, Zap, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/authApi';
import { getBookingsByUser } from '../api/bookingsApi';
import type { Booking } from '../types';

export default function ProfilePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveOk, setSaveOk] = useState(false);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        if (user) {
            setEditName(user.name);
            setEditPhone(user.phone);
            setBookingsLoading(true);
            getBookingsByUser(user.id)
                .then(setBookings)
                .catch(() => setBookings([]))
                .finally(() => setBookingsLoading(false));
        }
    }, [user, isAuthenticated, navigate]);

    if (!user) return null;

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'Confirmed').length,
        cancelled: bookings.filter(b => b.status === 'Cancelled').length,
        completed: bookings.filter(b => b.status === 'Completed').length,
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        setSaveOk(false);
        try {
            await updateProfile({ name: editName.trim(), phone: editPhone.trim() });
            setSaveOk(true);
            setEditing(false);
            setTimeout(() => setSaveOk(false), 3000);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditName(user.name);
        setEditPhone(user.phone);
        setSaveError('');
        setEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const avatarLetter = (user.name || 'U')[0].toUpperCase();

    return (
        <div
            className="page-container fade-in"
            style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem 3rem' }}
        >
            {/* Page header */}
            <div style={{ paddingTop: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <User size={22} color="#22c55e" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#f1f5f9' }}>
                        My Profile
                    </h1>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage your account details</p>
            </div>

            {/* Avatar + name hero */}
            <div
                className="card"
                style={{
                    marginBottom: '1.25rem',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '150px', height: '150px',
                    background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '68px', height: '68px', flexShrink: 0,
                        background: 'linear-gradient(135deg, #22c55e, #10b981)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', fontWeight: 800, color: 'white',
                        boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
                    }}>
                        {avatarLetter}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#f1f5f9', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.email}
                        </div>
                    </div>
                    {!editing && (
                        <button
                            id="edit-profile-btn"
                            onClick={() => setEditing(true)}
                            style={{
                                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                borderRadius: '0.6rem', padding: '0.5rem 0.9rem',
                                color: '#22c55e', cursor: 'pointer', fontSize: '0.82rem',
                                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem',
                                flexShrink: 0, transition: 'all 0.2s',
                            }}
                        >
                            <Edit3 size={14} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Account Details */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{
                    fontSize: '0.78rem', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem',
                }}>
                    Account Details
                </h2>

                {editing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {/* Name field */}
                        <div>
                            <label htmlFor="profile-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    id="profile-name"
                                    type="text"
                                    className="input-field"
                                    style={{ paddingLeft: '2.4rem' }}
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    placeholder="Full name"
                                />
                            </div>
                        </div>
                        {/* Phone field */}
                        <div>
                            <label htmlFor="profile-phone" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
                                Phone Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    id="profile-phone"
                                    type="tel"
                                    className="input-field"
                                    style={{ paddingLeft: '2.4rem' }}
                                    value={editPhone}
                                    onChange={e => setEditPhone(e.target.value)}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>

                        {saveError && (
                            <p style={{ color: '#f87171', fontSize: '0.82rem', margin: 0 }}>{saveError}</p>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                id="save-profile-btn"
                                onClick={handleSave}
                                disabled={saving || !editName.trim()}
                                className="btn-primary"
                                style={{ flex: 1, padding: '0.65rem', fontSize: '0.9rem' }}
                            >
                                {saving ? 'Saving…' : <><Check size={15} /> Save Changes</>}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn-secondary"
                                style={{ padding: '0.65rem 1rem', fontSize: '0.9rem' }}
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { icon: <User size={15} color="#22c55e" />, label: 'Full Name', value: user.name },
                            { icon: <Mail size={15} color="#22c55e" />, label: 'Email', value: user.email },
                            { icon: <Phone size={15} color="#22c55e" />, label: 'Phone', value: user.phone },
                        ].map(row => (
                            <div key={row.label} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.6rem 0.85rem', background: '#0f172a',
                                borderRadius: '0.65rem',
                            }}>
                                {row.icon}
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.1rem' }}>{row.label}</div>
                                    <div style={{ color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 500 }}>{row.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {saveOk && (
                    <div style={{
                        marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        color: '#22c55e', fontSize: '0.85rem',
                    }}>
                        <Check size={15} /> Profile updated successfully
                    </div>
                )}
            </div>

            {/* Booking Stats */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{
                    fontSize: '0.78rem', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem',
                }}>
                    Booking Summary
                </h2>
                {bookingsLoading ? (
                    <div style={{ color: '#475569', fontSize: '0.85rem' }}>Loading stats…</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {[
                            { label: 'Total', value: stats.total, color: '#94a3b8' },
                            { label: 'Active', value: stats.confirmed, color: '#22c55e' },
                            { label: 'Completed', value: stats.completed, color: '#3b82f6' },
                            { label: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: '#0f172a', borderRadius: '0.75rem',
                                padding: '0.85rem 1rem',
                                border: `1px solid ${s.color}22`,
                            }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick links */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{
                    fontSize: '0.78rem', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem',
                }}>
                    Quick Links
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', borderRadius: '0.65rem', overflow: 'hidden' }}>
                    {[
                        { icon: <BookOpen size={16} color="#22c55e" />, label: 'My Bookings', to: '/my-bookings' },
                        { icon: <Zap size={16} color="#22c55e" />, label: 'Find Stations', to: '/' },
                        { icon: <Shield size={16} color="#22c55e" />, label: 'Privacy & Security', to: '#' },
                    ].map((item, i) => (
                        <button
                            key={item.label}
                            onClick={() => item.to !== '#' && navigate(item.to)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.9rem 0.85rem',
                                background: i % 2 === 0 ? '#0f172a' : 'transparent',
                                border: 'none', cursor: 'pointer',
                                color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500,
                                textAlign: 'left', width: '100%',
                                transition: 'background 0.15s',
                            }}
                        >
                            {item.icon}
                            <span style={{ flex: 1 }}>{item.label}</span>
                            <ChevronRight size={15} color="#475569" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <button
                id="logout-btn"
                onClick={handleLogout}
                style={{
                    width: '100%', padding: '0.9rem',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '0.85rem', color: '#f87171', cursor: 'pointer',
                    fontWeight: 700, fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.2s',
                }}
            >
                <LogOut size={17} /> Sign Out
            </button>
        </div>
    );
}
