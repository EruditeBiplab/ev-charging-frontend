// src/pages/StationDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Zap, Wifi, Car, Coffee, Bath, ChevronLeft, Check } from 'lucide-react';
import type { Station } from '../types';
import { getStationById } from '../api/stationsApi';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const amenityIcon: Record<string, React.ReactNode> = {
    WiFi: <Wifi size={14} />, Parking: <Car size={14} />,
    Café: <Coffee size={14} />, 'Food Court': <Coffee size={14} />,
    Restroom: <Bath size={14} />,
};

function AvailabilityBadge({ availability }: { availability: Station['availability'] }) {
    if (availability === 'Available') return <span className="badge-available">● Available</span>;
    if (availability === 'Few Slots') return <span className="badge-few">● Few Slots</span>;
    return <span className="badge-full">● Full</span>;
}

export default function StationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [station, setStation] = useState<Station | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getStationById(id).then(s => {
            if (!s) setNotFound(true);
            else setStation(s);
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <LoadingSkeleton variant="detail" />
        </div>
    );

    if (notFound || !station) return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h2>Station not found</h2>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>
                Back to Search
            </button>
        </div>
    );

    return (
        <div className="page-container fade-in" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '6rem' }}>
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: 'none', border: 'none', color: '#94a3b8',
                    cursor: 'pointer', padding: '1rem 1rem 0',
                    fontSize: '0.9rem', fontWeight: 500,
                }}
                aria-label="Go back"
            >
                <ChevronLeft size={18} /> Back
            </button>

            {/* Map placeholder */}
            <div style={{
                margin: '1rem',
                height: '180px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f2027 100%)',
                borderRadius: '1rem',
                border: '1px solid #334155',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '0.5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Fake map grid */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <line key={`h${i}`} x1="0" y1={`${i * 30}`} x2="100%" y2={`${i * 30}`} stroke="#22c55e" strokeWidth="1" />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <line key={`v${i}`} x1={`${i * 60}`} y1="0" x2={`${i * 60}`} y2="100%" stroke="#22c55e" strokeWidth="1" />
                    ))}
                </svg>
                <div style={{
                    background: 'linear-gradient(135deg, #22c55e, #10b981)',
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 0 8px rgba(34,197,94,0.2)',
                }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Map View</span>
            </div>

            {/* Content */}
            <div style={{ padding: '0 1rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h1 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#f1f5f9', margin: 0, flex: 1, paddingRight: '1rem', lineHeight: 1.3 }}>
                        {station.name}
                    </h1>
                    <AvailabilityBadge availability={station.availability} />
                </div>

                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <MapPin size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{station.address}, {station.city}</span>
                </div>

                {/* Rating + Price */}
                <div className="card" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem', padding: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
                            <Star size={16} color="#f59e0b" fill="#f59e0b" />
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{station.rating}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{station.reviewCount} reviews</div>
                    </div>
                    <div style={{ width: '1px', background: '#334155' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#22c55e' }}>₹{station.pricePerKwh}/kWh</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Base price</div>
                    </div>
                    <div style={{ width: '1px', background: '#334155' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{station.availablePorts}/{station.totalPorts}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ports free</div>
                    </div>
                    <div style={{ width: '1px', background: '#334155' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#94a3b8' }}>{station.distance} km</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Away</div>
                    </div>
                </div>

                {/* Connectors */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Connector Types
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {station.connectors.map(c => (
                            <span key={c} style={{
                                background: '#0f172a', border: '1px solid #334155',
                                borderRadius: '0.5rem', padding: '0.3rem 0.8rem',
                                fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500,
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                            }}>
                                <Zap size={12} color="#22c55e" /> {c}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Amenities
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {station.amenities.map(a => (
                            <span key={a} style={{
                                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                                borderRadius: '0.5rem', padding: '0.3rem 0.8rem',
                                fontSize: '0.82rem', color: '#4ade80', fontWeight: 500,
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                            }}>
                                {amenityIcon[a] ?? <Check size={12} />} {a}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Reviews summary */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Reviews
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>{station.rating}</div>
                            <div style={{ display: 'flex', gap: '2px', marginTop: '0.25rem' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={12} color="#f59e0b" fill={i <= Math.round(station.rating) ? '#f59e0b' : 'none'} />
                                ))}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>{station.reviewCount} reviews</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {[5, 4, 3, 2, 1].map(star => {
                                const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                                return (
                                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.72rem', color: '#64748b', width: '8px' }}>{star}</span>
                                        <Star size={10} color="#f59e0b" fill="#f59e0b" />
                                        <div style={{ flex: 1, height: '6px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: '#64748b', width: '28px' }}>{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '1rem',
                background: 'rgba(15,23,42,0.97)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid #334155',
                zIndex: 100,
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '1.05rem', padding: '0.9rem' }}
                        onClick={() => navigate(`/station/${station.id}/book`)}
                        disabled={station.availability === 'Full'}
                        aria-label={`Book slot at ${station.name}`}
                    >
                        <Zap size={18} fill="white" />
                        {station.availability === 'Full' ? 'Fully Booked' : 'Book Slot'}
                    </button>
                </div>
            </div>
        </div>
    );
}
