// backend/src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../middleware/auth';

const router = Router();

// Minimal uuid without extra dep
function makeId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body as {
            name?: string; email?: string; phone?: string; password?: string;
        };

        if (!name || !email || !phone || !password) {
            res.status(400).json({ error: 'name, email, phone, and password are required' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters' });
            return;
        }

        const db = getDb();
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            res.status(409).json({ error: 'Email already registered. Please login instead.' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const id = makeId();

        db.prepare(
            'INSERT INTO users (id, name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)'
        ).run(id, name.trim(), email.trim().toLowerCase(), phone.trim(), passwordHash);

        const token = jwt.sign({ userId: id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            token,
            user: { id, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            res.status(400).json({ error: 'email and password are required' });
            return;
        }

        const db = getDb();
        const user = db.prepare(
            'SELECT id, name, email, phone, password_hash FROM users WHERE email = ?'
        ).get(email.trim().toLowerCase()) as unknown as {
            id: string; name: string; email: string; phone: string; password_hash: string;
        } | undefined;

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/me  [JWT protected]
router.get('/me', (req: Request, res: Response) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET) as { userId: string; email: string };
        const db = getDb();
        const user = db.prepare(
            'SELECT id, name, email, phone FROM users WHERE id = ?'
        ).get(payload.userId) as { id: string; name: string; email: string; phone: string } | undefined;
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// PUT /api/auth/me  [JWT protected]
router.put('/me', (req: Request, res: Response) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET) as { userId: string; email: string };
        const { name, phone } = req.body as { name?: string; phone?: string };
        if (!name && !phone) {
            res.status(400).json({ error: 'Provide name or phone to update' });
            return;
        }
        const db = getDb();
        if (name) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), payload.userId);
        if (phone) db.prepare('UPDATE users SET phone = ? WHERE id = ?').run(phone.trim(), payload.userId);
        const updated = db.prepare(
            'SELECT id, name, email, phone FROM users WHERE id = ?'
        ).get(payload.userId) as { id: string; name: string; email: string; phone: string };
        res.json(updated);
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

export default router;

