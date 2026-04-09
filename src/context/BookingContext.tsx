// src/context/BookingContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { PendingBooking, Booking, VehicleDetails } from '../types';

interface BookingContextValue {
    pendingBooking: PendingBooking | null;
    setPendingBooking: (b: PendingBooking | null) => void;
    lastBooking: Booking | null;
    setLastBooking: (b: Booking | null) => void;
    vehicleDetails: VehicleDetails | null;
    setVehicleDetails: (v: VehicleDetails | null) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
    const [lastBooking, setLastBookingState] = useState<Booking | null>(() => {
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
        <BookingContext.Provider value={{
            pendingBooking, setPendingBooking,
            lastBooking, setLastBooking,
            vehicleDetails, setVehicleDetails,
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBookingContext() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBookingContext must be used inside BookingProvider');
    return ctx;
}
