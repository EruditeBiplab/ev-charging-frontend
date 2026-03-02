// src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Calendar, Clock, Shield, AlertCircle } from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../api/bookingsApi';
import type { PaymentMethod } from '../types';
import PaymentOption from '../components/ui/PaymentOption';

export default function CheckoutPage() {
    const { pendingBooking, setPendingBooking, setLastBooking } = useBookingContext();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!pendingBooking) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h2>No booking in progress</h2>
                <p style={{ color: '#64748b' }}>Please select a slot first.</p>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>
                    Find Stations
                </button>
            </div>
        );
    }

    const { station, slot, totalAmount } = pendingBooking;
    const tax = Math.round(totalAmount * 0.18);
    const convFee = 5;
    const grand = totalAmount + tax + convFee;

    const handlePay = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const booking = await createBooking({
                userId: user.id,
                stationId: station.id,
                stationName: station.name,
                slotId: slot.id,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                chargerType: slot.chargerType,
                totalAmount: grand,
                paymentMethod: selectedMethod,
            });
            setLastBooking(booking);
            setPendingBooking(null);
            navigate('/payment-success');
        } catch {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const dateLabel = new Date(slot.date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <div className="page-container fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem 2rem' }}>
            {/* Header */}
            <div style={{ paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 500, padding: 0, marginBottom: '0.75rem' }}
                >
                    <ChevronLeft size={18} /> Back
                </button>
                <h1 className="section-title">Checkout</h1>
            </div>

            {/* Booking Summary */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                    Booking Summary
                </h2>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: '0.75rem' }}>{station.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <Calendar size={13} color="#22c55e" />
                        <span>{dateLabel}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <Clock size={13} color="#22c55e" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <Zap size={13} color="#22c55e" />
                        <span>{slot.chargerType} Charger · ₹{slot.pricePerKwh}/kWh</span>
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                    Price Breakdown
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                        { label: 'Charging (15 kWh)', value: `₹${totalAmount}` },
                        { label: 'GST (18%)', value: `₹${tax}` },
                        { label: 'Convenience Fee', value: `₹${convFee}` },
                    ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.88rem' }}>
                            <span>{row.label}</span>
                            <span>{row.value}</span>
                        </div>
                    ))}
                    <div style={{ height: '1px', background: '#334155', margin: '0.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>
                        <span>Total Amount</span>
                        <span style={{ color: '#22c55e' }}>₹{grand}</span>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(['UPI', 'Card', 'Wallet'] as PaymentMethod[]).map(method => (
                        <PaymentOption
                            key={method}
                            method={method}
                            selected={selectedMethod === method}
                            onSelect={setSelectedMethod}
                        />
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '0.75rem', padding: '0.75rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '1rem', color: '#f87171', fontSize: '0.88rem',
                }} role="alert">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
                <Shield size={14} color="#22c55e" />
                Secured by 256-bit SSL encryption
            </div>

            {/* Pay Now */}
            <button
                className="btn-primary"
                style={{ width: '100%', fontSize: '1.05rem', padding: '1rem' }}
                onClick={handlePay}
                disabled={loading}
                aria-label={`Pay ₹${grand} via ${selectedMethod}`}
            >
                {loading ? (
                    <>
                        <span style={{
                            width: '18px', height: '18px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white', borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 0.7s linear infinite',
                        }} />
                        Processing Payment...
                    </>
                ) : (
                    <>Pay ₹{grand} via {selectedMethod}</>
                )}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
