// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, phone: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function saveSession(token: string, user: User) {
    localStorage.setItem('ev_token', token);
    localStorage.setItem('ev_user', JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('ev_user');
        return stored ? JSON.parse(stored) as User : null;
    });

    // On mount, silently validate the stored token.
    // If the server rejects it (expired/invalid), clear the stale session.
    useEffect(() => {
        const token = localStorage.getItem('ev_token');
        if (!token) return;
        fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
            if (res.status === 401) {
                setUser(null);
                localStorage.removeItem('ev_token');
                localStorage.removeItem('ev_user');
            }
        }).catch(() => { /* network offline — keep session */ });
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Login failed' })) as { error: string };
            throw new Error(err.error || 'Login failed');
        }
        const { token, user: u } = await res.json() as { token: string; user: User };
        saveSession(token, u);
        setUser(u);
    };

    const register = async (name: string, email: string, phone: string, password: string) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Registration failed' })) as { error: string };
            throw new Error(err.error || 'Registration failed');
        }
        const { token, user: u } = await res.json() as { token: string; user: User };
        saveSession(token, u);
        setUser(u);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ev_user');
        localStorage.removeItem('ev_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
