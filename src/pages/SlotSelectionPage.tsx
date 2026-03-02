// src/pages/SlotSelectionPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Zap, AlertCircle } from 'lucide-react';
import type { Station, Slot } from '../types';
import { getStationById, getSlotsByStation } from '../api/stationsApi';
import { useBookingContext } from '../context/BookingContext';

import SlotChip from '../components/ui/SlotChip';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const SESSION_KWH = 15; // assume 15 kWh per session for price calc

export default function SlotSelectionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setPendingBooking } = useBookingContext();

    const [station, setStation] = useState<Station | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loadingStation, setLoadingStation] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [chargerFilter, setChargerFilter] = useState<'All' | 'Fast' | 'Standard'>('All');

    // Date range: today + 3 days
    const dateOptions = useMemo(() => {
        const days: { value: string; label: string }[] = [];
        const today = new Date();
        for (let i = 0; i < 4; i++) {
            const d = new Date(today.getTime() + i * 86400000);
            const value = d.toISOString().split('T')[0];
            const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
            days.push({ value, label });
        }
        return days;
    }, []);

    useEffect(() => {
        if (!id) return;
        getStationById(id).then(s => { setStation(s || null); setLoadingStation(false); });
    }, [id]);

    useEffect(() => {
        if (!id) return;
        setLoadingSlots(true);
        setSelectedSlot(null);
        getSlotsByStation(id, selectedDate).then(s => { setSlots(s); setLoadingSlots(false); });
    }, [id, selectedDate]);

    const filteredSlots = useMemo(() => {
        if (chargerFilter === 'All') return slots;
        return slots.filter(s => s.chargerType === chargerFilter);
    }, [slots, chargerFilter]);

    const totalAmount = selectedSlot ? Math.round(selectedSlot.pricePerKwh * SESSION_KWH) : 0;

    const handleConfirm = () => {
        if (!selectedSlot || !station) return;
        setPendingBooking({ station, slot: selectedSlot, totalAmount });
        navigate('/checkout');
    };

    if (loadingStation) return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <LoadingSkeleton variant="detail" />
        </div>
    );

    if (!station) return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Station not found</h2>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>Back</button>
        </div>
    );

    return (
        <div className="page-container fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem 7rem' }}>
            {/* Header */}
            <div style={{ paddingTop: '1rem' }}>
                <button
                    onClick={() => navigate(`/station/${id}`)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 500, padding: 0, marginBottom: '0.75rem' }}
                >
                    <ChevronLeft size={18} /> Back
                </button>
                <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Select Slot</h1>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{station.name}</p>
            </div>

            {/* Date picker */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> Select Date
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {dateOptions.map(d => (
                        <button
                            key={d.value}
                            onClick={() => setSelectedDate(d.value)}
                            aria-pressed={selectedDate === d.value}
                            style={{
                                flexShrink: 0,
                                padding: '0.6rem 1rem',
                                borderRadius: '0.75rem',
                                border: `1px solid ${selectedDate === d.value ? '#22c55e' : '#334155'}`,
                                background: selectedDate === d.value ? 'rgba(34,197,94,0.1)' : '#1e293b',
                                color: selectedDate === d.value ? '#22c55e' : '#94a3b8',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {d.label}
                        </button>
                    ))}

                    {/* Native date fallback */}
                    <button
                        onClick={() => {
                            const el = document.getElementById('custom-date-input') as HTMLInputElement;
                            el?.showPicker?.();
                        }}
                        style={{
                            flexShrink: 0,
                            padding: '0.6rem 1rem',
                            borderRadius: '0.75rem',
                            border: '1px solid #334155',
                            background: '#1e293b',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                        }}
                        aria-label="Pick custom date"
                    >
                        📅 Pick Date
                    </button>
                    <input
                        id="custom-date-input"
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setSelectedDate(e.target.value)}
                        aria-label="Custom date picker"
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0 }}
                    />
                </div>
            </div>

            {/* Charger type filter */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={14} /> Charger Type
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['All', 'Fast', 'Standard'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setChargerFilter(type)}
                            aria-pressed={chargerFilter === type}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.75rem',
                                border: `1px solid ${chargerFilter === type ? '#22c55e' : '#334155'}`,
                                background: chargerFilter === type ? 'rgba(34,197,94,0.1)' : '#1e293b',
                                color: chargerFilter === type ? '#22c55e' : '#94a3b8',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                            }}
                        >
                            {type === 'Fast' && <Zap size={13} fill={chargerFilter === 'Fast' ? '#22c55e' : 'none'} />}
                            {type}
                        </button>
                    ))}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
                    Fast: ₹{station.pricePerKwh + 3}/kWh · Standard: ₹{station.pricePerKwh}/kWh
                </div>
            </div>

            {/* Slots grid */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Available Time Slots
                </h2>

                {loadingSlots ? (
                    <LoadingSkeleton variant="slot" count={8} />
                ) : filteredSlots.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '2rem',
                        background: '#1e293b', borderRadius: '1rem',
                        border: '1px solid #334155',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😴</div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No slots available for this date/type. Try another date.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            {filteredSlots.map(slot => (
                                <SlotChip
                                    key={slot.id}
                                    slot={slot}
                                    selected={selectedSlot?.id === slot.id}
                                    onSelect={setSelectedSlot}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', display: 'inline-block' }} />
                                Available
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1e293b', border: '1px solid #334155', opacity: 0.45, display: 'inline-block' }} />
                                Booked
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Selected info Alert */}
            {selectedSlot && (
                <div style={{
                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: '0.75rem', padding: '0.75rem 1rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '1.5rem',
                }} role="status">
                    <div>
                        <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.9rem' }}>
                            {selectedSlot.startTime} – {selectedSlot.endTime} · {selectedSlot.chargerType}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                            {SESSION_KWH} kWh session
                        </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#22c55e' }}>₹{totalAmount}</div>
                </div>
            )}

            {!selectedSlot && !loadingSlots && filteredSlots.some(s => s.available) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    Please select a time slot to continue
                </div>
            )}

            {/* Sticky CTA */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '1rem', background: 'rgba(15,23,42,0.97)',
                backdropFilter: 'blur(12px)', borderTop: '1px solid #334155', zIndex: 100,
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
                        onClick={handleConfirm}
                        disabled={!selectedSlot}
                    >
                        Confirm Booking {selectedSlot ? `― ₹${totalAmount}` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}
