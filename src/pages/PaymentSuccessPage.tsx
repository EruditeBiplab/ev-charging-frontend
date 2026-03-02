// src/pages/PaymentSuccessPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';

export default function PaymentSuccessPage() {
    const { lastBooking } = useBookingContext();
    const navigate = useNavigate();

    // Redirect if no booking context
    useEffect(() => {
        if (!lastBooking) {
            const t = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(t);
        }
    }, [lastBooking, navigate]);

    if (!lastBooking) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <p style={{ color: '#64748b' }}>Redirecting...</p>
            </div>
        );
    }

    const dateLabel = new Date(lastBooking.date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%), #0f172a',
            }}
        >
            <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }} className="slide-up">
                {/* Success icon */}
                <div style={{
                    width: '96px', height: '96px',
                    background: 'linear-gradient(135deg, #22c55e, #10b981)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 0 16px rgba(34,197,94,0.12), 0 0 0 32px rgba(34,197,94,0.06)',
                    animation: 'pulse 2s ease infinite',
                }}
                    aria-label="Payment successful"
                >
                    <CheckCircle size={48} color="white" fill="white" />
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.4rem' }}>
                    Booking Confirmed!
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Your EV charging slot has been reserved
                </p>

                {/* Booking details card */}
                <div className="card" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <div style={{
                        background: '#0f172a', borderRadius: '0.5rem', padding: '0.6rem 0.9rem',
                        marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Booking Reference</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#22c55e', fontSize: '0.9rem' }}>
                            {lastBooking.id}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                            <MapPin size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{lastBooking.stationName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                            <Calendar size={14} color="#22c55e" />
                            <span>{dateLabel}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                            <Clock size={14} color="#22c55e" />
                            <span>{lastBooking.startTime} – {lastBooking.endTime}</span>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#334155', margin: '1rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Amount Paid</span>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#22c55e' }}>₹{lastBooking.totalAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Payment Method</span>
                        <span style={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.85rem' }}>{lastBooking.paymentMethod}</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '1rem', padding: '0.9rem', marginBottom: '0.75rem' }}
                    onClick={() => navigate('/my-bookings')}
                    aria-label="Go to My Bookings"
                >
                    Go to My Bookings
                </button>

                <button
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '0.9rem' }}
                    onClick={() => navigate('/')}
                >
                    Find Another Station
                </button>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 16px rgba(34,197,94,0.12), 0 0 0 32px rgba(34,197,94,0.06); }
          50% { box-shadow: 0 0 0 20px rgba(34,197,94,0.18), 0 0 0 40px rgba(34,197,94,0.08); }
        }
      `}</style>
        </div>
    );
}
