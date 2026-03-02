// src/components/layout/Navbar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, BookOpen, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = isAuthenticated
        ? [{ to: '/', label: 'Stations' }, { to: '/my-bookings', label: 'My Bookings' }]
        : [{ to: '/', label: 'Stations' }];

    return (
        <nav
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderBottom: '1px solid #334155',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                            style={{
                                width: '36px', height: '36px',
                                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Zap size={20} color="white" fill="white" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#f1f5f9' }}>
                            EV<span style={{ color: '#22c55e' }}>Charge</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                style={{
                                    textDecoration: 'none',
                                    color: location.pathname === link.to ? '#22c55e' : '#94a3b8',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    transition: 'color 0.2s',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                    👋 {user?.name.split(' ')[0]}
                                </span>
                                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                                    <LogOut size={15} /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                    <LogIn size={15} /> Login
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none' }}
                        className="mobile-menu-btn"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {menuOpen && (
                    <div
                        style={{
                            borderTop: '1px solid #334155',
                            padding: '1rem 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    textDecoration: 'none',
                                    color: location.pathname === link.to ? '#22c55e' : '#94a3b8',
                                    fontWeight: 500,
                                    padding: '0.5rem 0',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                                <LogOut size={15} /> Logout
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)}>
                                <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>
                                    <LogIn size={15} /> Login
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
        </nav>
    );
}
