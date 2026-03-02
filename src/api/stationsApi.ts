// src/api/stationsApi.ts
import { stations } from '../data/stations';
import { slots } from '../data/slots';
import type { Station, Slot, FilterOptions } from '../types';

const delay = (ms = 800) => new Promise(res => setTimeout(res, ms));

export async function searchStations(query: string, filters: FilterOptions): Promise<Station[]> {
    await delay();
    let result = stations.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase()) ||
        s.address.toLowerCase().includes(query.toLowerCase())
    );

    if (filters.fastCharging) {
        result = result.filter(s => s.connectors.some(c => c.toLowerCase().includes('ccs') || c.toLowerCase().includes('chad')));
    }

    if (filters.sortBy === 'distance') {
        result = result.sort((a, b) => a.distance - b.distance);
    } else if (filters.sortBy === 'price') {
        result = result.sort((a, b) => a.pricePerKwh - b.pricePerKwh);
    } else if (filters.sortBy === 'rating') {
        result = result.sort((a, b) => b.rating - a.rating);
    }

    return result;
}

export async function getStationById(id: string): Promise<Station | undefined> {
    await delay(600);
    return stations.find(s => s.id === id);
}

export async function getSlotsByStation(stationId: string, date: string): Promise<Slot[]> {
    await delay(700);
    return slots.filter(s => s.stationId === stationId && s.date === date);
}
