// src/components/ui/FilterSheet.tsx
import { X, ArrowUpDown, Zap, DollarSign } from 'lucide-react';
import type { FilterOptions } from '../../types';

interface FilterSheetProps {
    open: boolean;
    onClose: () => void;
    filters: FilterOptions;
    onChange: (f: FilterOptions) => void;
}

export default function FilterSheet({ open, onClose, filters, onChange }: FilterSheetProps) {
    if (!open) return null;

    const setSortBy = (val: FilterOptions['sortBy']) => {
        onChange({ ...filters, sortBy: filters.sortBy === val ? '' : val });
    };

    const toggleFastCharging = () => {
        onChange({ ...filters, fastCharging: !filters.fastCharging });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    zIndex: 200, backdropFilter: 'blur(2px)',
                }}
                aria-hidden
            />

            {/* Sheet */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Filter stations"
                style={{
                    position: 'fixed',
                    bottom: 0, left: 0, right: 0,
                    background: '#1e293b',
                    borderTop: '2px solid #334155',
                    borderRadius: '1.25rem 1.25rem 0 0',
                    padding: '1.5rem 1.25rem 2rem',
                    zIndex: 201,
                    animation: 'slideUp 0.25s ease',
                    maxWidth: '600px',
                    margin: '0 auto',
                }}
            >
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, color: '#f1f5f9' }}>Filter & Sort</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
                        aria-label="Close filter"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Sort by Distance */}
                    <button
                        onClick={() => setSortBy('distance')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.9rem 1rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${filters.sortBy === 'distance' ? '#22c55e' : '#334155'}`,
                            background: filters.sortBy === 'distance' ? 'rgba(34,197,94,0.1)' : '#0f172a',
                            color: filters.sortBy === 'distance' ? '#22c55e' : '#f1f5f9',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            width: '100%',
                            textAlign: 'left',
                        }}
                        aria-pressed={filters.sortBy === 'distance'}
                    >
                        <ArrowUpDown size={18} />
                        Sort by Distance
                        {filters.sortBy === 'distance' && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700 }}>✓ Active</span>
                        )}
                    </button>

                    {/* Sort by Price */}
                    <button
                        onClick={() => setSortBy('price')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.9rem 1rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${filters.sortBy === 'price' ? '#22c55e' : '#334155'}`,
                            background: filters.sortBy === 'price' ? 'rgba(34,197,94,0.1)' : '#0f172a',
                            color: filters.sortBy === 'price' ? '#22c55e' : '#f1f5f9',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            width: '100%',
                            textAlign: 'left',
                        }}
                        aria-pressed={filters.sortBy === 'price'}
                    >
                        <DollarSign size={18} />
                        Sort by Price
                        {filters.sortBy === 'price' && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700 }}>✓ Active</span>
                        )}
                    </button>

                    {/* Fast Charging */}
                    <button
                        onClick={toggleFastCharging}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.9rem 1rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${filters.fastCharging ? '#22c55e' : '#334155'}`,
                            background: filters.fastCharging ? 'rgba(34,197,94,0.1)' : '#0f172a',
                            color: filters.fastCharging ? '#22c55e' : '#f1f5f9',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            width: '100%',
                            textAlign: 'left',
                        }}
                        aria-pressed={filters.fastCharging}
                    >
                        <Zap size={18} fill={filters.fastCharging ? '#22c55e' : 'none'} />
                        Fast Charging Only
                        {filters.fastCharging && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700 }}>✓ On</span>
                        )}
                    </button>
                </div>

                {/* Clear */}
                <button
                    onClick={() => { onChange({ sortBy: '', fastCharging: false }); onClose(); }}
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: '1.25rem' }}
                >
                    Clear All Filters
                </button>
            </div>
        </>
    );
}
