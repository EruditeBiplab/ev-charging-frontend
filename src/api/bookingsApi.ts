// src/api/bookingsApi.ts
import type { Booking, PaymentMethod, ChargerType } from '../types';

const BASE = '/api';

function getToken(): string | null {
    return localStorage.getItem('ev_token');
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function createBooking(params: {
    userId: string;
    stationId: string;
    stationName: string;
    slotId: string;
    date: string;
    startTime: string;
    endTime: string;
    chargerType: ChargerType;
    totalAmount: number;
    paymentMethod: PaymentMethod;
}): Promise<Booking> {
    const res = await fetch(`${BASE}/bookings`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(params),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to create booking' })) as { error: string };
        throw new Error(err.error || 'Failed to create booking');
    }
    return res.json() as Promise<Booking>;
}

export async function getBookingsByUser(_userId: string): Promise<Booking[]> {
    const res = await fetch(`${BASE}/bookings/me`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json() as Promise<Booking[]>;
}

export async function cancelBooking(bookingId: string): Promise<void> {
    const res = await fetch(`${BASE}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: authHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to cancel booking' })) as { error: string };
        throw new Error(err.error || 'Failed to cancel booking');
    }
}
