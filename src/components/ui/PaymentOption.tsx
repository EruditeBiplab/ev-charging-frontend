// src/components/ui/PaymentOption.tsx
import type { PaymentMethod } from '../../types';
import { Smartphone, CreditCard, Wallet } from 'lucide-react';

interface PaymentOptionProps {
    method: PaymentMethod;
    selected: boolean;
    onSelect: (method: PaymentMethod) => void;
}

const methodConfig: Record<PaymentMethod, { icon: React.ReactNode; label: string; subtitle: string }> = {
    UPI: {
        icon: <Smartphone size={22} />,
        label: 'UPI',
        subtitle: 'Pay via any UPI app',
    },
    Card: {
        icon: <CreditCard size={22} />,
        label: 'Credit / Debit Card',
        subtitle: 'Visa, Mastercard, RuPay',
    },
    Wallet: {
        icon: <Wallet size={22} />,
        label: 'Wallet',
        subtitle: 'Paytm, PhonePe, Amazon Pay',
    },
};

export default function PaymentOption({ method, selected, onSelect }: PaymentOptionProps) {
    const config = methodConfig[method];

    return (
        <button
            onClick={() => onSelect(method)}
            aria-pressed={selected}
            aria-label={`Select payment method: ${config.label}`}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '0.9rem',
                border: `2px solid ${selected ? '#22c55e' : '#334155'}`,
                background: selected ? 'rgba(34,197,94,0.08)' : '#1e293b',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
            }}
        >
            {/* Icon */}
            <div style={{
                width: '44px', height: '44px',
                borderRadius: '0.75rem',
                background: selected ? 'rgba(34,197,94,0.2)' : '#0f172a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: selected ? '#22c55e' : '#64748b',
                flexShrink: 0,
                transition: 'all 0.2s',
            }}>
                {config.icon}
            </div>

            {/* Labels */}
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: selected ? '#22c55e' : '#f1f5f9' }}>
                    {config.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
                    {config.subtitle}
                </div>
            </div>

            {/* Radio indicator */}
            <div style={{
                width: '20px', height: '20px',
                borderRadius: '50%',
                border: `2px solid ${selected ? '#22c55e' : '#475569'}`,
                background: selected ? '#22c55e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
            }}>
                {selected && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />}
            </div>
        </button>
    );
}
