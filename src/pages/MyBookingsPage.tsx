// src/pages/MyBookingsPage.tsx
import { useEffect, useState } from 'react';
import { BookOpen, Zap } from 'lucide-react';
import type { Booking } from '../types';
import { getBookingsByUser, cancelBooking } from '../api/bookingsApi';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/ui/BookingCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

export default function MyBookingsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');

    const loadBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getBookingsByUser(user.id);
            setBookings(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBookings(); }, [user]);

    const handleCancel = async (id: string) => {
        await cancelBooking(id);
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' as const } : b));
    };

    const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

    const tabs: Array<typeof filter> = ['All', 'Confirmed', 'Completed', 'Cancelled'];

    return (
        <div className="page-container fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
            {/* Header */}
            <div style={{ padding: '2rem 0 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <BookOpen size={24} color="#22c55e" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#f1f5f9' }}>My Bookings</h1>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '0.4rem', overflowX: 'auto',
                paddingBottom: '1rem', position: 'sticky', top: '64px',
                background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)',
                zIndex: 50, paddingTop: '0.5rem',
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        aria-pressed={filter === tab}
                        style={{
                            flexShrink: 0,
                            padding: '0.4rem 0.9rem',
                            borderRadius: '9999px',
                            border: `1px solid ${filter === tab ? '#22c55e' : '#334155'}`,
                            background: filter === tab ? 'rgba(34,197,94,0.1)' : 'transparent',
                            color: filter === tab ? '#22c55e' : '#94a3b8',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {tab}
                        {tab !== 'All' && (
                            <span style={{ marginLeft: '0.3rem', fontSize: '0.72rem', opacity: 0.7 }}>
                                ({bookings.filter(b => b.status === tab).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSkeleton variant="booking" count={3} />
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: '#1e293b', borderRadius: '1rem',
                    border: '1px solid #334155',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                        {filter === 'All' ? 'No bookings yet' : `No ${filter} bookings`}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        {filter === 'All' ? 'Book your first EV charging slot to get started!' : `You have no ${filter.toLowerCase()} bookings.`}
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/')}
                    >
                        <Zap size={16} />
                        Find Stations
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filtered.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onCancel={handleCancel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
