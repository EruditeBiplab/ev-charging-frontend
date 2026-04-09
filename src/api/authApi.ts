// src/api/authApi.ts
import type { User } from '../types';

const BASE = '/api/auth';

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('ev_token');
    return token
        ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
}

export async function getMe(): Promise<User> {
    const res = await fetch(`${BASE}/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json() as Promise<User>;
}

export async function updateProfile(data: { name?: string; phone?: string }): Promise<User> {
    const res = await fetch(`${BASE}/me`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Update failed' })) as { error: string };
        throw new Error(err.error || 'Update failed');
    }
    return res.json() as Promise<User>;
}
