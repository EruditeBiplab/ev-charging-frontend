// src/pages/VehicleDetailsPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Battery, Clock, AlertCircle, Car, CheckCircle } from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import type { VehicleDetails } from '../types';

// ─── EV Model Database (Indian market) ───────────────────────────────────────
const EV_MODELS: { label: string; capacity: number }[] = [
    { label: 'Tata Nexon EV Max',    capacity: 40.5 },
    { label: 'Tata Tiago EV',        capacity: 24.0 },
    { label: 'Tata Punch EV',        capacity: 35.0 },
    { label: 'Tata Curvv EV',        capacity: 55.0 },
    { label: 'MG ZS EV',             capacity: 50.3 },
    { label: 'MG Windsor EV',        capacity: 38.0 },
    { label: 'Hyundai Ioniq 5',      capacity: 72.6 },
    { label: 'Hyundai Creta EV',     capacity: 51.4 },
    { label: 'Kia EV6',              capacity: 77.4 },
    { label: 'Kia EV9',              capacity: 99.8 },
    { label: 'BYD Atto 3',           capacity: 60.5 },
    { label: 'BYD Seal',             capacity: 82.6 },
    { label: 'Mahindra XEV 9e',      capacity: 79.0 },
    { label: 'Mahindra BE 6e',       capacity: 59.0 },
    { label: 'BMW iX1',              capacity: 64.7 },
    { label: 'Volvo EX40',           capacity: 82.0 },
    { label: 'Custom / Other',       capacity: 0    },
];

// Charger power ratings (kW)
const CHARGER_POWER = { Fast: 50, Standard: 7.4 };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcEstimates(capacity: number, current: number, target: number, chargerType: 'Fast' | 'Standard') {
    const energy = parseFloat(((capacity * (target - current)) / 100).toFixed(2));
    const power  = CHARGER_POWER[chargerType];
    const mins   = Math.ceil((energy / power) * 60);
    return { energy: Math.max(0, energy), mins: Math.max(0, mins) };
}

function formatTime(mins: number) {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

// ─── Battery visual bar ───────────────────────────────────────────────────────
function BatteryBar({ current, target }: { current: number; target: number }) {
    return (
        <div style={{ margin: '1rem 0 0.5rem' }}>
            <div style={{
                position: 'relative', height: '28px',
                background: '#0f172a', borderRadius: '14px',
                border: '2px solid #334155', overflow: 'hidden',
            }}>
                {/* Filled region (current) */}
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${current}%`,
                    background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)',
                    borderRadius: '12px 0 0 12px',
                    transition: 'width 0.3s ease',
                }} />
                {/* Top-up region (target - current) */}
                {target > current && (
                    <div style={{
                        position: 'absolute', left: `${current}%`, top: 0, bottom: 0,
                        width: `${target - current}%`,
                        background: 'linear-gradient(90deg, rgba(34,197,94,0.4), rgba(34,197,94,0.7))',
                        borderLeft: '2px dashed #22c55e',
                        transition: 'all 0.3s ease',
                    }} />
                )}
                {/* Labels */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 10px', fontSize: '0.72rem', fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                }}>
                    <span>{current}%</span>
                    <span style={{ color: '#22c55e' }}>{target}%</span>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569', marginTop: '4px' }}>
                <span style={{ color: '#3b82f6' }}>● Current</span>
                <span style={{ color: '#22c55e' }}>● Target</span>
            </div>
        </div>
    );
}

// ─── Slider component ─────────────────────────────────────────────────────────
function RangeSlider({ id, value, onChange, min = 0, max = 100, color = '#22c55e' }: {
    id: string; value: number; onChange: (v: number) => void;
    min?: number; max?: number; color?: string;
}) {
    return (
        <div style={{ position: 'relative' }}>
            <input
                id={id}
                type="range"
                min={min} max={max}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    width: '100%', height: '6px', appearance: 'none',
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`,
                    borderRadius: '3px', outline: 'none', cursor: 'pointer',
                    accentColor: color,
                }}
            />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VehicleDetailsPage() {
    const { pendingBooking, setPendingBooking, setVehicleDetails } = useBookingContext();
    const navigate = useNavigate();

    const [modelIdx, setModelIdx]         = useState(0);
    const [customCapacity, setCustomCapacity] = useState('');
    const [currentLevel, setCurrentLevel] = useState(20);
    const [targetLevel, setTargetLevel]   = useState(80);
    const [submitted, setSubmitted]       = useState(false);
    const [errors, setErrors]             = useState<{ model?: string; capacity?: string; levels?: string }>({});

    // Redirect if no booking context (user typed URL directly)
    useEffect(() => {
        if (!pendingBooking) navigate('/');
    }, [pendingBooking, navigate]);

    if (!pendingBooking) return null;

    const isCustom = EV_MODELS[modelIdx].label === 'Custom / Other';
    const batteryCapacity = isCustom
        ? parseFloat(customCapacity) || 0
        : EV_MODELS[modelIdx].capacity;

    const chargerType = pendingBooking.slot.chargerType;
    const { energy, mins } = useMemo(
        () => calcEstimates(batteryCapacity, currentLevel, targetLevel, chargerType),
        [batteryCapacity, currentLevel, targetLevel, chargerType]
    );

    const estimatedCost = pendingBooking.slot.pricePerKwh * energy;

    // ── Validation ──
    const validate = () => {
        const e: typeof errors = {};
        if (modelIdx === 0 && EV_MODELS[0].label === 'Custom / Other') {
            e.model = 'Please select a vehicle model';
        }
        if (isCustom && (!customCapacity || parseFloat(customCapacity) <= 0)) {
            e.capacity = 'Please enter a valid battery capacity (kWh)';
        }
        if (targetLevel <= currentLevel) {
            e.levels = 'Target battery level must be greater than current level';
        }
        if (currentLevel < 0 || currentLevel > 100 || targetLevel < 0 || targetLevel > 100) {
            e.levels = 'Battery levels must be between 0% and 100%';
        }
        return e;
    };

    const handleProceed = () => {
        setSubmitted(true);
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        const details: VehicleDetails = {
            model: EV_MODELS[modelIdx].label,
            batteryCapacity,
            currentLevel,
            targetLevel,
            requiredEnergy: energy,
            estimatedMinutes: mins,
        };
        setVehicleDetails(details);

        // Update totalAmount in pendingBooking based on actual required energy
        setPendingBooking({
            ...pendingBooking,
            totalAmount: Math.round(estimatedCost),
        });

        navigate('/checkout');
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.8rem', fontWeight: 600,
        color: '#94a3b8', marginBottom: '0.5rem',
    };

    return (
        <div className="page-container fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem 7rem' }}>
            {/* Header */}
            <div style={{ paddingTop: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 500, padding: 0, marginBottom: '0.75rem' }}
                >
                    <ChevronLeft size={18} /> Back
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <Car size={22} color="#22c55e" />
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#f1f5f9' }}>Vehicle Details</h1>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    {pendingBooking.station.name} · {pendingBooking.slot.chargerType} Charger
                </p>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.75rem' }}>
                {['Select Slot', 'Vehicle Details', 'Checkout'].map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                        <div style={{
                            width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                            background: i === 0 ? '#22c55e' : i === 1 ? 'linear-gradient(135deg,#22c55e,#10b981)' : '#1e293b',
                            border: i === 2 ? '1px solid #334155' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700,
                            color: i < 2 ? 'white' : '#475569',
                            boxShadow: i === 1 ? '0 0 10px rgba(34,197,94,0.4)' : 'none',
                        }}>
                            {i === 0 ? <CheckCircle size={13} /> : i + 1}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: i === 1 ? '#22c55e' : '#475569', fontWeight: i === 1 ? 700 : 400, marginLeft: '0.4rem', marginRight: '0.4rem', whiteSpace: 'nowrap' }}>
                            {step}
                        </span>
                        {i < 2 && <div style={{ flex: 1, height: '1px', background: i === 0 ? '#22c55e' : '#334155', marginRight: '0.4rem' }} />}
                    </div>
                ))}
            </div>

            {/* ── EV Model selector ── */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                    EV Model
                </h2>

                <div>
                    <label htmlFor="ev-model" style={labelStyle}>Select your vehicle</label>
                    <select
                        id="ev-model"
                        value={modelIdx}
                        onChange={e => { setModelIdx(Number(e.target.value)); setSubmitted(false); setErrors({}); }}
                        style={{
                            width: '100%', padding: '0.75rem 1rem',
                            background: '#0f172a', color: '#f1f5f9',
                            border: `1px solid ${errors.model && submitted ? '#ef4444' : '#334155'}`,
                            borderRadius: '0.65rem', fontSize: '0.92rem',
                            outline: 'none', cursor: 'pointer', appearance: 'none',
                        }}
                    >
                        {EV_MODELS.map((m, i) => (
                            <option key={m.label} value={i} style={{ background: '#1e293b' }}>
                                {m.label}{m.capacity > 0 ? ` — ${m.capacity} kWh` : ''}
                            </option>
                        ))}
                    </select>
                    {errors.model && submitted && (
                        <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <AlertCircle size={13} /> {errors.model}
                        </p>
                    )}
                </div>

                {/* Custom capacity input */}
                {isCustom && (
                    <div style={{ marginTop: '0.85rem' }}>
                        <label htmlFor="custom-capacity" style={labelStyle}>Battery Capacity (kWh)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="custom-capacity"
                                type="number"
                                min="1" max="200" step="0.1"
                                placeholder="e.g. 60"
                                value={customCapacity}
                                onChange={e => { setCustomCapacity(e.target.value); setErrors({}); }}
                                className="input-field"
                                style={{ paddingRight: '3.5rem', borderColor: errors.capacity && submitted ? '#ef4444' : undefined }}
                            />
                            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.82rem' }}>
                                kWh
                            </span>
                        </div>
                        {errors.capacity && submitted && (
                            <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <AlertCircle size={13} /> {errors.capacity}
                            </p>
                        )}
                    </div>
                )}

                {/* Capacity badge */}
                {!isCustom && (
                    <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.85rem', background: '#0f172a', borderRadius: '0.6rem' }}>
                        <Battery size={15} color="#3b82f6" />
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Battery capacity: </span>
                        <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.9rem' }}>{batteryCapacity} kWh</span>
                    </div>
                )}
            </div>

            {/* ── Battery Levels ── */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                    Battery Levels
                </h2>

                {/* Battery visualizer */}
                <BatteryBar current={currentLevel} target={targetLevel} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
                    {/* Current level */}
                    <div>
                        <label htmlFor="current-level" style={{ ...labelStyle, color: '#3b82f6' }}>
                            Current Level — <strong style={{ color: '#60a5fa' }}>{currentLevel}%</strong>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                id="current-level-num"
                                type="number"
                                min={0} max={99}
                                value={currentLevel}
                                onChange={e => { setCurrentLevel(Math.min(99, Math.max(0, Number(e.target.value)))); setErrors({}); }}
                                style={{
                                    width: '64px', padding: '0.4rem 0.5rem',
                                    background: '#0f172a', border: '1px solid #334155',
                                    borderRadius: '0.5rem', color: '#60a5fa',
                                    fontWeight: 700, fontSize: '0.9rem', textAlign: 'center',
                                    outline: 'none',
                                }}
                            />
                            <span style={{ color: '#475569', fontSize: '0.8rem' }}>%</span>
                        </div>
                        <RangeSlider id="current-level" value={currentLevel} onChange={v => { setCurrentLevel(Math.min(v, targetLevel - 1)); setErrors({}); }} color="#3b82f6" />
                    </div>

                    {/* Target level */}
                    <div>
                        <label htmlFor="target-level" style={{ ...labelStyle, color: '#22c55e' }}>
                            Target Level — <strong style={{ color: '#4ade80' }}>{targetLevel}%</strong>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                id="target-level-num"
                                type="number"
                                min={1} max={100}
                                value={targetLevel}
                                onChange={e => { setTargetLevel(Math.min(100, Math.max(1, Number(e.target.value)))); setErrors({}); }}
                                style={{
                                    width: '64px', padding: '0.4rem 0.5rem',
                                    background: '#0f172a', border: '1px solid #334155',
                                    borderRadius: '0.5rem', color: '#4ade80',
                                    fontWeight: 700, fontSize: '0.9rem', textAlign: 'center',
                                    outline: 'none',
                                }}
                            />
                            <span style={{ color: '#475569', fontSize: '0.8rem' }}>%</span>
                        </div>
                        <RangeSlider id="target-level" value={targetLevel} onChange={v => { setTargetLevel(Math.max(v, currentLevel + 1)); setErrors({}); }} color="#22c55e" />
                    </div>
                </div>

                {/* Levels error */}
                {errors.levels && submitted && (
                    <div style={{
                        marginTop: '0.75rem', padding: '0.6rem 0.85rem',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        color: '#f87171', fontSize: '0.82rem',
                    }}>
                        <AlertCircle size={14} /> {errors.levels}
                    </div>
                )}
            </div>

            {/* ── Estimates Panel ── */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(16,185,129,0.04) 100%)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '1rem', padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: '0 0 24px rgba(34,197,94,0.06)',
            }}>
                <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={13} fill="#22c55e" /> Charging Estimate
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    {[
                        { icon: <Battery size={18} color="#3b82f6" />, label: 'Energy Required', value: batteryCapacity > 0 ? `${energy} kWh` : '—' },
                        { icon: <Clock size={18} color="#f59e0b" />, label: 'Est. Charge Time', value: batteryCapacity > 0 && energy > 0 ? formatTime(mins) : '—' },
                        { icon: <Zap size={18} color="#22c55e" />, label: 'Est. Cost', value: batteryCapacity > 0 && energy > 0 ? `₹${Math.round(estimatedCost)}` : '—' },
                    ].map(item => (
                        <div key={item.label} style={{
                            background: '#0f172a', borderRadius: '0.75rem',
                            padding: '0.85rem 0.75rem', textAlign: 'center',
                            border: '1px solid #1e293b',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>{item.icon}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.2rem', lineHeight: 1 }}>
                                {item.value}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#475569', lineHeight: 1.2 }}>{item.label}</div>
                        </div>
                    ))}
                </div>

                {batteryCapacity > 0 && energy > 0 && (
                    <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#475569', borderTop: '1px solid rgba(34,197,94,0.12)', paddingTop: '0.75rem' }}>
                        <span style={{ color: '#22c55e' }}>⚡</span> Using <strong style={{ color: '#94a3b8' }}>{chargerType} charger</strong> at{' '}
                        <strong style={{ color: '#94a3b8' }}>{CHARGER_POWER[chargerType]} kW</strong> · Charging from{' '}
                        <strong style={{ color: '#60a5fa' }}>{currentLevel}%</strong> to{' '}
                        <strong style={{ color: '#4ade80' }}>{targetLevel}%</strong>
                    </div>
                )}
            </div>

            {/* Charger info note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.77rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={13} color="#f59e0b" />
                Estimates are based on ideal conditions. Actual charging time may vary.
            </div>

            {/* Sticky CTA */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '1rem', background: 'rgba(15, 23, 42, 0.97)',
                backdropFilter: 'blur(12px)', borderTop: '1px solid #334155', zIndex: 100,
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <button
                        id="proceed-to-checkout-btn"
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
                        onClick={handleProceed}
                    >
                        Proceed to Checkout
                        {batteryCapacity > 0 && energy > 0 && ` — ₹${Math.round(estimatedCost)}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
