// src/data/slots.ts
import type { Slot } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const d0 = fmt(today);
const d1 = fmt(new Date(today.getTime() + 86400000));
const d2 = fmt(new Date(today.getTime() + 2 * 86400000));
const d3 = fmt(new Date(today.getTime() + 3 * 86400000));

interface RawSlot {
    stationId: string;
    date: string;
    startTime: string;
    endTime: string;
    chargerType: 'Fast' | 'Standard';
    available: boolean;
    pricePerKwh: number;
}

const rawSlots: RawSlot[] = [
    // Station s1
    { stationId: 's1', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d0, startTime: '09:00', endTime: '10:00', chargerType: 'Fast', available: false, pricePerKwh: 18 },
    { stationId: 's1', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d0, startTime: '11:00', endTime: '12:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
    { stationId: 's1', date: d0, startTime: '12:00', endTime: '13:00', chargerType: 'Standard', available: false, pricePerKwh: 15 },
    { stationId: 's1', date: d0, startTime: '14:00', endTime: '15:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d0, startTime: '15:00', endTime: '16:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
    { stationId: 's1', date: d0, startTime: '16:00', endTime: '17:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d1, startTime: '09:00', endTime: '10:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d1, startTime: '10:00', endTime: '11:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
    { stationId: 's1', date: d1, startTime: '11:00', endTime: '12:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d2, startTime: '08:00', endTime: '09:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's1', date: d2, startTime: '13:00', endTime: '14:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
    { stationId: 's1', date: d3, startTime: '10:00', endTime: '11:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    // Station s2
    { stationId: 's2', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Standard', available: true, pricePerKwh: 14 },
    { stationId: 's2', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Standard', available: false, pricePerKwh: 14 },
    { stationId: 's2', date: d0, startTime: '12:00', endTime: '13:00', chargerType: 'Fast', available: true, pricePerKwh: 17 },
    { stationId: 's2', date: d1, startTime: '09:00', endTime: '10:00', chargerType: 'Standard', available: true, pricePerKwh: 14 },
    { stationId: 's2', date: d1, startTime: '11:00', endTime: '12:00', chargerType: 'Fast', available: true, pricePerKwh: 17 },
    // Station s3
    { stationId: 's3', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Standard', available: true, pricePerKwh: 16 },
    { stationId: 's3', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Fast', available: true, pricePerKwh: 19 },
    { stationId: 's3', date: d0, startTime: '14:00', endTime: '15:00', chargerType: 'Standard', available: false, pricePerKwh: 16 },
    { stationId: 's3', date: d1, startTime: '09:00', endTime: '10:00', chargerType: 'Fast', available: true, pricePerKwh: 19 },
    { stationId: 's3', date: d2, startTime: '11:00', endTime: '12:00', chargerType: 'Standard', available: true, pricePerKwh: 16 },
    // Station s4
    { stationId: 's4', date: d0, startTime: '07:00', endTime: '08:00', chargerType: 'Fast', available: true, pricePerKwh: 16 },
    { stationId: 's4', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Fast', available: true, pricePerKwh: 16 },
    { stationId: 's4', date: d0, startTime: '09:00', endTime: '10:00', chargerType: 'Standard', available: true, pricePerKwh: 13 },
    { stationId: 's4', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Fast', available: false, pricePerKwh: 16 },
    { stationId: 's4', date: d1, startTime: '08:00', endTime: '09:00', chargerType: 'Fast', available: true, pricePerKwh: 16 },
    { stationId: 's4', date: d1, startTime: '12:00', endTime: '13:00', chargerType: 'Standard', available: true, pricePerKwh: 13 },
    // Station s5
    { stationId: 's5', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Standard', available: false, pricePerKwh: 15 },
    { stationId: 's5', date: d1, startTime: '10:00', endTime: '11:00', chargerType: 'Standard', available: false, pricePerKwh: 15 },
    { stationId: 's5', date: d2, startTime: '08:00', endTime: '09:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
    // Station s6
    { stationId: 's6', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Fast', available: true, pricePerKwh: 15 },
    { stationId: 's6', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Standard', available: true, pricePerKwh: 12 },
    { stationId: 's6', date: d0, startTime: '12:00', endTime: '13:00', chargerType: 'Fast', available: true, pricePerKwh: 15 },
    { stationId: 's6', date: d1, startTime: '09:00', endTime: '10:00', chargerType: 'Standard', available: true, pricePerKwh: 12 },
    // Station s7
    { stationId: 's7', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Standard', available: false, pricePerKwh: 14 },
    { stationId: 's7', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Fast', available: false, pricePerKwh: 17 },
    { stationId: 's7', date: d1, startTime: '09:00', endTime: '10:00', chargerType: 'Standard', available: true, pricePerKwh: 14 },
    // Station s8
    { stationId: 's8', date: d0, startTime: '08:00', endTime: '09:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's8', date: d0, startTime: '10:00', endTime: '11:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
    { stationId: 's8', date: d0, startTime: '14:00', endTime: '15:00', chargerType: 'Fast', available: true, pricePerKwh: 18 },
    { stationId: 's8', date: d1, startTime: '11:00', endTime: '12:00', chargerType: 'Standard', available: true, pricePerKwh: 15 },
];

export const slots: Slot[] = rawSlots.map((s, i) => ({ ...s, id: `slot-${i + 1}` }));
