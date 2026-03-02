// src/context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
    user: User | null;
    login: (name: string, email: string, phone: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('ev_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (name: string, email: string, phone: string) => {
        const u: User = { id: 'u1', name, email, phone };
        setUser(u);
        localStorage.setItem('ev_user', JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ev_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
