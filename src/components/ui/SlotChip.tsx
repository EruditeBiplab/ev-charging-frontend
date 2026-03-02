// src/components/ui/SlotChip.tsx
import type { Slot } from '../../types';
import { Zap } from 'lucide-react';

interface SlotChipProps {
    slot: Slot;
    selected: boolean;
    onSelect: (slot: Slot) => void;
}

export default function SlotChip({ slot, selected, onSelect }: SlotChipProps) {
    const unavailable = !slot.available;

    return (
        <button
            onClick={() => !unavailable && onSelect(slot)}
            disabled={unavailable}
            aria-pressed={selected}
            aria-label={`Slot ${slot.startTime} to ${slot.endTime}, ${slot.chargerType} charger, ${unavailable ? 'unavailable' : 'available'}`}
            style={{
                width: '92px',
                height: '72px',
                borderRadius: '0.75rem',
                border: selected
                    ? '2px solid #22c55e'
                    : unavailable
                        ? '1px solid #1e293b'
                        : '1px solid #334155',
                background: selected
                    ? 'rgba(34,197,94,0.15)'
                    : unavailable
                        ? 'rgba(30,41,59,0.4)'
                        : '#1e293b',
                cursor: unavailable ? 'not-allowed' : 'pointer',
                opacity: unavailable ? 0.45 : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {selected && (
                <div style={{
                    position: 'absolute', top: 4, right: 4,
                    width: '10px', height: '10px',
                    background: '#22c55e',
                    borderRadius: '50%',
                }} />
            )}
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: selected ? '#22c55e' : unavailable ? '#475569' : '#f1f5f9' }}>
                {slot.startTime}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>–</span>
            <span style={{ fontSize: '0.72rem', color: selected ? '#4ade80' : '#94a3b8' }}>
                {slot.endTime}
            </span>
            {slot.chargerType === 'Fast' && (
                <Zap size={10} fill={selected ? '#22c55e' : '#334155'} color={selected ? '#22c55e' : '#334155'} />
            )}
        </button>
    );
}
