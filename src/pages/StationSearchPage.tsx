// src/pages/StationSearchPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Zap, MapPin } from 'lucide-react';
import type { Station, FilterOptions } from '../types';
import { searchStations } from '../api/stationsApi';
import StationCard from '../components/ui/StationCard';
import FilterSheet from '../components/ui/FilterSheet';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function StationSearchPage() {
    const [query, setQuery] = useState('');
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({ sortBy: '', fastCharging: false });
    const navigate = useNavigate();

    const fetchStations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await searchStations(query.trim(), filters);
            setStations(res);
        } finally {
            setLoading(false);
        }
    }, [query, filters]);

    useEffect(() => {
        const t = setTimeout(fetchStations, 300);
        return () => clearTimeout(t);
    }, [fetchStations]);

    const activeFilterCount = [filters.sortBy !== '', filters.fastCharging].filter(Boolean).length;

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
            {/* Hero */}
            <div style={{
                padding: '2rem 0 1.5rem',
                textAlign: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Zap size={28} color="#22c55e" fill="#22c55e" />
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#f1f5f9' }}>
                        Find EV Chargers
                    </h1>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                    <MapPin size={13} style={{ verticalAlign: 'middle' }} /> Bengaluru, Karnataka
                </p>
            </div>

            {/* Search + Filter bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', position: 'sticky', top: '64px', zIndex: 50, paddingBottom: '0.75rem', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{
                        position: 'absolute', left: '0.9rem', top: '50%',
                        transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none',
                    }} />
                    <input
                        id="station-search"
                        type="search"
                        className="input-field"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="Search by location or station name"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        aria-label="Search charging stations"
                    />
                </div>

                <button
                    onClick={() => setFilterOpen(true)}
                    aria-label="Open filters"
                    style={{
                        position: 'relative',
                        width: '48px', height: '48px',
                        borderRadius: '0.75rem',
                        border: activeFilterCount > 0 ? '2px solid #22c55e' : '1px solid #334155',
                        background: activeFilterCount > 0 ? 'rgba(34,197,94,0.1)' : '#1e293b',
                        color: activeFilterCount > 0 ? '#22c55e' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                    }}
                >
                    <SlidersHorizontal size={20} />
                    {activeFilterCount > 0 && (
                        <span style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '18px', height: '18px',
                            background: '#22c55e', color: 'white',
                            borderRadius: '50%', fontSize: '0.65rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Results count */}
            {!loading && (
                <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{stations.length} station{stations.length !== 1 ? 's' : ''} found</span>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => setFilters({ sortBy: '', fastCharging: false })}
                            style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, padding: 0 }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSkeleton variant="card" count={4} />
            ) : stations.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: '#1e293b', borderRadius: '1rem',
                    border: '1px solid #334155',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No stations found</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        Try a different search term or clear your filters
                    </p>
                    <button
                        onClick={() => { setQuery(''); setFilters({ sortBy: '', fastCharging: false }); }}
                        className="btn-secondary"
                        style={{ marginTop: '1rem' }}
                    >
                        Reset Search
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stations.map(station => (
                        <StationCard
                            key={station.id}
                            station={station}
                            onView={id => navigate(`/station/${id}`)}
                        />
                    ))}
                </div>
            )}

            <FilterSheet
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                filters={filters}
                onChange={f => { setFilters(f); }}
            />
        </div>
    );
}
