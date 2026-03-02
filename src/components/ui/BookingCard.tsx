// src/components/ui/BookingCard.tsx
import type { Booking } from '../../types';
import { Calendar, Clock, Zap, XCircle } from 'lucide-react';
import QRCodeBox from './QRCodeBox';
import { useState } from 'react';

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: string) => void;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
    if (status === 'Confirmed') return <span className="badge-available">{status}</span>;
    if (status === 'Completed') return (
        <span style={{
            background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
            padding: '0.2rem 0.6rem', borderRadius: '9999px',
            fontSize: '0.75rem', fontWeight: 600,
            border: '1px solid rgba(99,102,241,0.3)',
        }}>{status}</span>
    );
    return <span className="badge-full">{status}</span>;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
    const [showQR, setShowQR] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
        setCancelling(true);
        await onCancel(booking.id);
        setCancelling(false);
    };

    const date = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <article className="card fade-in" aria-label={`Booking at ${booking.stationName}`}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', margin: 0, flex: 1, paddingRight: '0.75rem', lineHeight: 1.3 }}>
                    {booking.stationName}
                </h3>
                <StatusBadge status={booking.status} />
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.83rem' }}>
                    <Calendar size={13} color="#22c55e" />
                    <span>{date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.83rem' }}>
                    <Clock size={13} color="#22c55e" />
                    <span>{booking.startTime} – {booking.endTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.83rem' }}>
                    <Zap size={13} color="#22c55e" />
                    <span>{booking.chargerType} Charge · ₹{booking.totalAmount}</span>
                </div>
            </div>

            {/* Ref ID */}
            <div style={{
                background: '#0f172a', borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem', marginBottom: '1rem',
                fontSize: '0.75rem', color: '#64748b',
            }}>
                Ref: <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{booking.id}</span>
            </div>

            {/* QR Code */}
            {showQR && (
                <div style={{ marginBottom: '1rem' }}>
                    <QRCodeBox bookingId={booking.id} />
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}
                    onClick={() => setShowQR(!showQR)}
                    aria-expanded={showQR}
                    aria-label="Toggle QR code for check-in"
                >
                    {showQR ? 'Hide QR' : '📱 QR Code'}
                </button>

                {booking.status === 'Confirmed' && (
                    <button
                        className="btn-danger"
                        onClick={handleCancel}
                        disabled={cancelling}
                        aria-label={`Cancel booking at ${booking.stationName}`}
                        style={{ flex: 1 }}
                    >
                        <XCircle size={14} />
                        {cancelling ? 'Cancelling...' : 'Cancel'}
                    </button>
                )}
            </div>
        </article>
    );
}
