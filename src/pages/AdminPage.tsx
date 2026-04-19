// src/pages/AdminPage.tsx
import { useEffect, useState } from 'react';
import { Database, Users, BookOpen, Zap, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

type Tab = 'bookings' | 'users' | 'stations';

interface AdminData {
    users: Record<string, string | number>[];
    bookings: Record<string, string | number>[];
    stations: Record<string, string | number>[];
}

const STATUS_COLOR: Record<string, string> = {
    Confirmed: '#22c55e',
    Cancelled:  '#ef4444',
    Completed:  '#3b82f6',
};

function Badge({ value }: { value: string }) {
    const color = STATUS_COLOR[value] ?? '#94a3b8';
    return (
        <span style={{
            padding: '0.2rem 0.65rem', borderRadius: '999px',
            background: `${color}18`, border: `1px solid ${color}44`,
            color, fontWeight: 700, fontSize: '0.75rem',
        }}>
            {value === 'Confirmed' ? <CheckCircle size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} /> : null}
            {value === 'Cancelled' ? <XCircle    size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} /> : null}
            {value}
        </span>
    );
}

function DataTable({ rows }: { rows: Record<string, string | number>[] }) {
    if (!rows.length) return <p style={{ color: '#475569', padding: '1rem' }}>No records.</p>;
    const cols = Object.keys(rows[0]);

    return (
        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #1e293b' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                    <tr style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
                        {cols.map(c => (
                            <th key={c} style={{
                                padding: '0.65rem 0.85rem', textAlign: 'left',
                                color: '#22c55e', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                                fontSize: '0.7rem', whiteSpace: 'nowrap',
                            }}>
                                {c.replace(/_/g, ' ')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} style={{
                            borderBottom: '1px solid #1e293b',
                            background: i % 2 === 0 ? '#0d1929' : '#111827',
                            transition: 'background 0.15s',
                        }}>
                            {cols.map(c => {
                                const val = String(row[c] ?? '—');
                                return (
                                    <td key={c} style={{
                                        padding: '0.6rem 0.85rem', color: '#cbd5e1',
                                        whiteSpace: c.includes('name') || c.includes('station') ? 'nowrap' : 'normal',
                                        maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {c === 'status' ? <Badge value={val} /> :
                                         c === 'total_amount' ? <span style={{ color: '#22c55e', fontWeight: 700 }}>₹{val}</span> :
                                         c === 'rating' ? <span style={{ color: '#f59e0b' }}>⭐ {val}</span> :
                                         c.includes('id') && val.startsWith('BK-') ? <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.78rem' }}>{val}</span> :
                                         val}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function AdminPage() {
    const [data, setData]       = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [tab, setTab]         = useState<Tab>('bookings');
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const load = () => {
        setLoading(true);
        setError('');
        fetch('/api/admin/data')
            .then(r => r.json())
            .then(d => { setData(d as AdminData); setLastRefresh(new Date()); })
            .catch(() => setError('Could not connect to backend. Make sure the server is running.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: 'bookings', label: 'Bookings',  icon: <BookOpen size={15} />, count: data?.bookings.length },
        { id: 'users',    label: 'Users',     icon: <Users    size={15} />, count: data?.users.length    },
        { id: 'stations', label: 'Stations',  icon: <Zap      size={15} />, count: data?.stations.length },
    ];

    // Summary stats
    const confirmed  = data?.bookings.filter(b => b.status === 'Confirmed').length  ?? 0;
    const cancelled  = data?.bookings.filter(b => b.status === 'Cancelled').length  ?? 0;
    const totalRev   = data?.bookings.filter(b => b.status === 'Confirmed')
                             .reduce((s, b) => s + Number(b.total_amount), 0) ?? 0;

    return (
        <div style={{ minHeight: '100vh', background: '#060e1a', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
            {/* Top bar */}
            <div style={{
                background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid #1e293b',
                padding: '0 2rem', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', height: '56px', position: 'sticky', top: 0, zIndex: 50,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                        width: '28px', height: '28px', background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                        borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Database size={15} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f1f5f9' }}>EVCharge</span>
                    <span style={{ color: '#334155', margin: '0 0.25rem' }}>›</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#94a3b8' }}>Database Viewer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                        Last refresh: {lastRefresh.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={load}
                        style={{
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: '0.5rem', padding: '0.35rem 0.75rem',
                            color: '#22c55e', cursor: 'pointer', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600,
                        }}
                    >
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
                {/* Title */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#f1f5f9' }}>
                        📊 Database Overview
                    </h1>
                    <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Live view of the SQLite database — <code style={{ color: '#64748b', background: '#1e293b', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.78rem' }}>backend/ev_charging.db</code>
                    </p>
                </div>

                {/* Stat cards */}
                {data && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Total Users',     value: data.users.length,    color: '#3b82f6', icon: '👤' },
                            { label: 'Total Bookings',  value: data.bookings.length, color: '#f59e0b', icon: '📅' },
                            { label: 'Confirmed',       value: confirmed,             color: '#22c55e', icon: '✅' },
                            { label: 'Cancelled',       value: cancelled,             color: '#ef4444', icon: '❌' },
                            { label: 'Revenue (Conf.)', value: `₹${totalRev}`,       color: '#22c55e', icon: '💰' },
                            { label: 'Stations',        value: data.stations.length, color: '#8b5cf6', icon: '⚡' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: '#0f172a', border: `1px solid ${s.color}22`,
                                borderRadius: '0.85rem', padding: '1rem',
                            }}>
                                <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.2rem' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0' }}>
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.6rem 1rem',
                                background: 'none', border: 'none',
                                borderBottom: `2px solid ${tab === t.id ? '#22c55e' : 'transparent'}`,
                                color: tab === t.id ? '#22c55e' : '#64748b',
                                fontWeight: tab === t.id ? 700 : 500,
                                cursor: 'pointer', fontSize: '0.88rem',
                                transition: 'all 0.15s', marginBottom: '-1px',
                            }}
                        >
                            {t.icon} {t.label}
                            {t.count !== undefined && (
                                <span style={{
                                    background: tab === t.id ? 'rgba(34,197,94,0.15)' : '#1e293b',
                                    color: tab === t.id ? '#22c55e' : '#64748b',
                                    borderRadius: '999px', padding: '0 0.45rem',
                                    fontSize: '0.72rem', fontWeight: 700,
                                }}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        Loading database...
                    </div>
                )}

                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '0.75rem', padding: '1rem 1.25rem', color: '#f87171',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {data && !loading && (
                    <>
                        {tab === 'bookings'  && <DataTable rows={data.bookings  as Record<string, string | number>[]} />}
                        {tab === 'users'     && <DataTable rows={data.users     as Record<string, string | number>[]} />}
                        {tab === 'stations'  && <DataTable rows={data.stations  as Record<string, string | number>[]} />}
                    </>
                )}

                <p style={{ marginTop: '1.25rem', fontSize: '0.72rem', color: '#334155', textAlign: 'center' }}>
                    🔒 Passwords are stored as bcrypt hashes and are never displayed · Data updates in real time
                </p>
            </div>
        </div>
    );
}
