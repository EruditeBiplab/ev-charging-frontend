// src/data/bookings.ts
import type { Booking } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const d_past1 = fmt(new Date(today.getTime() - 7 * 86400000));
const d_past2 = fmt(new Date(today.getTime() - 2 * 86400000));

export const seedBookings: Booking[] = [
    {
        id: 'BK-20250101',
        userId: 'u1',
        stationId: 's1',
        slotId: 'slot-1',
        stationName: 'ElectroPark Charging Hub',
        date: d_past1,
        startTime: '09:00',
        endTime: '10:00',
        chargerType: 'Fast',
        totalAmount: 250,
        status: 'Completed',
        paymentMethod: 'UPI',
        createdAt: new Date(today.getTime() - 7 * 86400000).toISOString(),
    },
    {
        id: 'BK-20250202',
        userId: 'u1',
        stationId: 's4',
        slotId: 'slot-25',
        stationName: 'BESCOM Fast Charge — Whitefield',
        date: d_past2,
        startTime: '11:00',
        endTime: '12:00',
        chargerType: 'Standard',
        totalAmount: 180,
        status: 'Completed',
        paymentMethod: 'Card',
        createdAt: new Date(today.getTime() - 2 * 86400000).toISOString(),
    },
    {
        id: 'BK-20250303',
        userId: 'u1',
        stationId: 's2',
        slotId: 'slot-15',
        stationName: 'GreenVolt Station — Koramangala',
        date: fmt(new Date(today.getTime() + 86400000)),
        startTime: '12:00',
        endTime: '13:00',
        chargerType: 'Fast',
        totalAmount: 290,
        status: 'Confirmed',
        paymentMethod: 'Wallet',
        createdAt: new Date().toISOString(),
    },
];
