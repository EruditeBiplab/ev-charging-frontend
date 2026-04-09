// src/api/stationsApi.ts
import type { Station, Slot, FilterOptions } from '../types';

const BASE = '/api';

export async function searchStations(query: string, filters: FilterOptions): Promise<Station[]> {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.fastCharging) params.set('fastCharging', 'true');

    const res = await fetch(`${BASE}/stations?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch stations');
    return res.json() as Promise<Station[]>;
}

export async function getStationById(id: string): Promise<Station | undefined> {
    const res = await fetch(`${BASE}/stations/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error('Failed to fetch station');
    return res.json() as Promise<Station>;
}

export async function getSlotsByStation(stationId: string, date: string): Promise<Slot[]> {
    const params = new URLSearchParams({ stationId, date });
    const res = await fetch(`${BASE}/slots?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch slots');
    return res.json() as Promise<Slot[]>;
}
