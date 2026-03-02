// src/types/index.ts
export type Availability = 'Available' | 'Few Slots' | 'Full';
export type BookingStatus = 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Card' | 'Wallet';
export type ChargerType = 'Fast' | 'Standard';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Station {
    id: string;
    name: string;
    address: string;
    city: string;
    distance: number;
    rating: number;
    reviewCount: number;
    availability: Availability;
    pricePerKwh: number;
    connectors: string[];
    amenities: string[];
    lat: number;
    lng: number;
    totalPorts: number;
    availablePorts: number;
}

export interface Slot {
    id: string;
    stationId: string;
    date: string;
    startTime: string;
    endTime: string;
    chargerType: ChargerType;
    available: boolean;
    pricePerKwh: number;
}

export interface Booking {
    id: string;
    userId: string;
    stationId: string;
    slotId: string;
    stationName: string;
    date: string;
    startTime: string;
    endTime: string;
    chargerType: ChargerType;
    totalAmount: number;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    createdAt: string;
}

export interface FilterOptions {
    sortBy: 'distance' | 'price' | 'rating' | '';
    fastCharging: boolean;
}

export interface PendingBooking {
    station: Station;
    slot: Slot;
    totalAmount: number;
}
