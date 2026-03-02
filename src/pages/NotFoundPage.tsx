// src/pages/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '2rem',
        }}>
            {/* Animated 404 */}
            <div style={{
                fontSize: '7rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #334155, #1e293b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-4px',
            }}>
                404
            </div>

            <div style={{
                width: '64px', height: '64px',
                background: 'rgba(34,197,94,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0.5rem auto 1.5rem',
                border: '2px solid rgba(34,197,94,0.2)',
            }}>
                <Zap size={28} color="#22c55e" />
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Oops! Page not found
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto 2rem' }}>
                Looks like this charging station went offline. Let's get you back on track.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => navigate('/')} className="btn-primary">
                    <Zap size={16} /> Find Stations
                </button>
                <button onClick={() => navigate(-1)} className="btn-secondary">
                    Go Back
                </button>
            </div>
        </div>
    );
}
