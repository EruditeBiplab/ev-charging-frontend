// src/components/ui/StationCard.tsx
import { MapPin, Star, Zap } from 'lucide-react';
import type { Station } from '../../types';

interface StationCardProps {
    station: Station;
    onView: (id: string) => void;
}

function AvailabilityBadge({ availability }: { availability: Station['availability'] }) {
    if (availability === 'Available') return <span className="badge-available">● Available</span>;
    if (availability === 'Few Slots') return <span className="badge-few">● Few Slots</span>;
    return <span className="badge-full">● Full</span>;
}

export default function StationCard({ station, onView }: StationCardProps) {
    return (
        <article
            className="card fade-in"
            style={{ cursor: 'default' }}
            aria-label={`Charging station: ${station.name}`}
        >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1, paddingRight: '0.75rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
                        {station.name}
                    </h3>
                </div>
                <AvailabilityBadge availability={station.availability} />
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="#22c55e" />
                    <span>{station.distance} km</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{station.rating}</span>
                    <span>({station.reviewCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                    <Zap size={14} color="#22c55e" />
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>₹{station.pricePerKwh}/kWh</span>
                </div>
            </div>

            {/* CTA */}
            <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => onView(station.id)}
                aria-label={`View details for ${station.name}`}
            >
                View Details
            </button>
        </article>
    );
}
