// src/api/bookingsApi.ts
import type { Booking, PaymentMethod, ChargerType } from '../types';
import { seedBookings } from '../data/bookings';

const delay = (ms = 1000) => new Promise(res => setTimeout(res, ms));

// In-memory store
const bookingStore: Booking[] = [...seedBookings];

let idCounter = 100;

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
    await delay(1200);
    const booking: Booking = {
        id: `BK-${Date.now().toString(36).toUpperCase()}${(++idCounter)}`,
        userId: params.userId,
        stationId: params.stationId,
        slotId: params.slotId,
        stationName: params.stationName,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
        chargerType: params.chargerType,
        totalAmount: params.totalAmount,
        status: 'Confirmed',
        paymentMethod: params.paymentMethod,
        createdAt: new Date().toISOString(),
    };
    bookingStore.push(booking);
    return booking;
}

export async function getBookingsByUser(userId: string): Promise<Booking[]> {
    await delay();
    return bookingStore
        .filter(b => b.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function cancelBooking(bookingId: string): Promise<void> {
    await delay(600);
    const idx = bookingStore.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
        bookingStore[idx] = { ...bookingStore[idx], status: 'Cancelled' };
    }
}
