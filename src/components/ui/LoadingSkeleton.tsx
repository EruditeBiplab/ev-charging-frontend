// src/components/ui/LoadingSkeleton.tsx
interface LoadingSkeletonProps {
    variant?: 'card' | 'detail' | 'booking' | 'slot';
    count?: number;
}

function SkeletonCard() {
    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="shimmer" style={{ width: '60%', height: '20px' }} />
                <div className="shimmer" style={{ width: '60px', height: '20px' }} />
            </div>
            <div className="shimmer" style={{ width: '40%', height: '14px', marginBottom: '0.75rem' }} />
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="shimmer" style={{ width: '80px', height: '14px' }} />
                <div className="shimmer" style={{ width: '80px', height: '14px' }} />
            </div>
            <div className="shimmer" style={{ width: '100%', height: '40px', borderRadius: '0.75rem' }} />
        </div>
    );
}

function SkeletonDetail() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="shimmer" style={{ width: '50%', height: '28px', marginBottom: '1rem' }} />
            <div className="shimmer" style={{ width: '100%', height: '200px', borderRadius: '1rem', marginBottom: '1rem' }} />
            <div className="shimmer" style={{ width: '70%', height: '16px', marginBottom: '0.5rem' }} />
            <div className="shimmer" style={{ width: '50%', height: '16px', marginBottom: '1.5rem' }} />
            <div className="shimmer" style={{ width: '100%', height: '48px', borderRadius: '0.75rem' }} />
        </div>
    );
}

function SkeletonBooking() {
    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div className="shimmer" style={{ width: '55%', height: '18px' }} />
                <div className="shimmer" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
            </div>
            <div className="shimmer" style={{ width: '40%', height: '13px', marginBottom: '0.5rem' }} />
            <div className="shimmer" style={{ width: '30%', height: '13px', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="shimmer" style={{ width: '80px', height: '32px', borderRadius: '0.5rem' }} />
                <div className="shimmer" style={{ width: '80px', height: '32px', borderRadius: '0.5rem' }} />
            </div>
        </div>
    );
}

function SkeletonSlot() {
    return (
        <div className="shimmer" style={{
            width: '90px', height: '64px', borderRadius: '0.75rem',
        }} />
    );
}

export default function LoadingSkeleton({ variant = 'card', count = 3 }: LoadingSkeletonProps) {
    const items = Array.from({ length: count });

    if (variant === 'detail') return <SkeletonDetail />;

    if (variant === 'slot') {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {items.map((_, i) => <SkeletonSlot key={i} />)}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((_, i) =>
                variant === 'booking' ? <SkeletonBooking key={i} /> : <SkeletonCard key={i} />
            )}
        </div>
    );
}
