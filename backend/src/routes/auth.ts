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

// POST /api/auth/forgot-password
// Generates a 6-digit OTP valid for 15 min and returns it (demo mode — in production this would be emailed)
router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body as { email?: string };
        if (!email) {
            res.status(400).json({ error: 'email is required' });
            return;
        }

        const db = getDb();
        const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase()) as { id: string } | undefined;

        // Always respond with success to avoid email enumeration
        if (!user) {
            res.json({ message: 'If that email is registered, a reset code has been sent.' });
            return;
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

        // Upsert: replace any existing OTP for this email
        db.prepare(`
            INSERT INTO password_reset_otps (email, otp, expires_at, used)
            VALUES (?, ?, ?, 0)
            ON CONFLICT(email) DO UPDATE SET otp=excluded.otp, expires_at=excluded.expires_at, used=0
        `).run(email.trim().toLowerCase(), otp, expiresAt);

        // In production, send otp via email. For demo, return it directly.
        res.json({
            message: 'If that email is registered, a reset code has been sent.',
            demo_otp: otp, // Remove this line in production
        });
    } catch (err) {
        console.error('POST /forgot-password error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/reset-password
// Verifies the OTP and sets a new password
router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body as {
            email?: string; otp?: string; newPassword?: string;
        };

        if (!email || !otp || !newPassword) {
            res.status(400).json({ error: 'email, otp, and newPassword are required' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters' });
            return;
        }

        const db = getDb();
        const record = db.prepare(
            'SELECT otp, expires_at, used FROM password_reset_otps WHERE email = ?'
        ).get(email.trim().toLowerCase()) as { otp: string; expires_at: string; used: number } | undefined;

        if (!record || record.used === 1) {
            res.status(400).json({ error: 'Invalid or already used reset code.' });
            return;
        }
        if (new Date(record.expires_at) < new Date()) {
            res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
            return;
        }
        if (record.otp !== otp.trim()) {
            res.status(400).json({ error: 'Incorrect reset code.' });
            return;
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        try {
            db.exec('BEGIN TRANSACTION');
            db.prepare('UPDATE users SET password_hash = ? WHERE email = ?')
              .run(passwordHash, email.trim().toLowerCase());
            db.prepare('UPDATE password_reset_otps SET used = 1 WHERE email = ?')
              .run(email.trim().toLowerCase());
            db.exec('COMMIT');
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error('POST /reset-password error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

