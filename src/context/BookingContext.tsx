// src/context/BookingContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { PendingBooking, Booking } from '../types';

interface BookingContextValue {
    pendingBooking: PendingBooking | null;
    setPendingBooking: (b: PendingBooking | null) => void;
    lastBooking: Booking | null;
    setLastBooking: (b: Booking | null) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
    const [lastBooking, setLastBookingState] = useState<Booking | null>(() => {
        // Hydrate from sessionStorage in case of page navigation
        const stored = sessionStorage.getItem('ev_last_booking');
        return stored ? JSON.parse(stored) as Booking : null;
    });

    const setLastBooking = useCallback((b: Booking | null) => {
        setLastBookingState(b);
        if (b) {
            sessionStorage.setItem('ev_last_booking', JSON.stringify(b));
        } else {
            sessionStorage.removeItem('ev_last_booking');
        }
    }, []);

    return (
        <BookingContext.Provider value={{ pendingBooking, setPendingBooking, lastBooking, setLastBooking }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBookingContext() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBookingContext must be used inside BookingProvider');
    return ctx;
}
