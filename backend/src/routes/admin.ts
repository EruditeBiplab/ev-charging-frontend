// backend/src/routes/admin.ts
import { Router, Request, Response } from 'express';
import { getDb } from '../db';

const router = Router();

// GET /api/admin/data — returns all tables for demo/presentation purposes
router.get('/data', (_req: Request, res: Response) => {
    const db = getDb();

    const users = db.prepare(
        'SELECT id, name, email, phone FROM users ORDER BY rowid ASC'
    ).all() as object[];

    const bookings = db.prepare(`
        SELECT id, user_id, station_name, date,
               start_time, end_time, charger_type,
               total_amount, status, payment_method, created_at
        FROM bookings ORDER BY created_at DESC
    `).all() as object[];

    const stations = db.prepare(
        'SELECT id, name, address, city, rating, review_count, price_per_kwh, availability FROM stations ORDER BY id ASC'
    ).all() as object[];

    res.json({ users, bookings, stations });
});

export default router;
