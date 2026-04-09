// backend/src/routes/bookings.ts
import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware, JwtPayload } from '../middleware/auth';

const router = Router();

type AuthedRequest = Request & { user: JwtPayload };

interface DbBooking {
    id: string; user_id: string; station_id: string; slot_id: string;
    station_name: string; date: string; start_time: string; end_time: string;
    charger_type: string; total_amount: number; status: string;
    payment_method: string; created_at: string;
}

function mapBooking(row: DbBooking) {
    return {
        id: row.id,
        userId: row.user_id,
        stationId: row.station_id,
        slotId: row.slot_id,
        stationName: row.station_name,
        date: row.date,
        startTime: row.start_time,
        endTime: row.end_time,
        chargerType: row.charger_type,
        totalAmount: row.total_amount,
        status: row.status,
        paymentMethod: row.payment_method,
        createdAt: row.created_at,
    };
}

function makeBookingId(): string {
    return `BK-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 999)}`;
}

// POST /api/bookings  [JWT protected]
router.post('/', authMiddleware, (req: Request, res: Response) => {
    try {
        const authed = req as AuthedRequest;
        const {
            stationId, slotId, stationName, date,
            startTime, endTime, chargerType, totalAmount, paymentMethod,
        } = req.body as {
            stationId?: string; slotId?: string; stationName?: string; date?: string;
            startTime?: string; endTime?: string; chargerType?: string;
            totalAmount?: number; paymentMethod?: string;
        };

        if (!stationId || !slotId || !stationName || !date || !startTime || !endTime || !chargerType || !totalAmount || !paymentMethod) {
            res.status(400).json({ error: 'Missing required booking fields' });
            return;
        }

        const db = getDb();

        // Check slot exists and is available
        const slot = db.prepare('SELECT id, available FROM slots WHERE id = ?').get(slotId) as
            { id: string; available: number } | undefined;
        if (!slot) {
            res.status(404).json({ error: 'Slot not found' });
            return;
        }
        if (slot.available === 0) {
            res.status(409).json({ error: 'Slot is no longer available' });
            return;
        }

        const id = makeBookingId();
        const now = new Date().toISOString();

        try {
            db.exec('BEGIN EXCLUSIVE TRANSACTION');
            db.prepare(`
                INSERT INTO bookings
                  (id, user_id, station_id, slot_id, station_name, date, start_time, end_time,
                   charger_type, total_amount, status, payment_method, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)
            `).run(id, authed.user.userId, stationId, slotId, stationName, date,
                   startTime, endTime, chargerType, totalAmount, paymentMethod, now);

            // Mark slot unavailable
            db.prepare('UPDATE slots SET available = 0 WHERE id = ?').run(slotId);
            db.exec('COMMIT');
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }

        const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as unknown as DbBooking;
        res.status(201).json(mapBooking(booking));
    } catch (err) {
        console.error('POST /bookings error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/bookings/me  [JWT protected]
router.get('/me', authMiddleware, (req: Request, res: Response) => {
    try {
        const authed = req as AuthedRequest;
        const db = getDb();
        const rows = db.prepare(
            'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC'
        ).all(authed.user.userId) as unknown as DbBooking[];
        res.json(rows.map(mapBooking));
    } catch (err) {
        console.error('GET /bookings/me error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/bookings/:id/cancel  [JWT protected]
router.patch('/:id/cancel', authMiddleware, (req: Request, res: Response) => {
    try {
        const authed = req as AuthedRequest;
        const db = getDb();
        const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as DbBooking | undefined;

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        if (booking.user_id !== authed.user.userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        if (booking.status === 'Cancelled') {
            res.status(400).json({ error: 'Booking is already cancelled' });
            return;
        }

        try {
            db.exec('BEGIN EXCLUSIVE TRANSACTION');
            db.prepare("UPDATE bookings SET status = 'Cancelled' WHERE id = ?").run(req.params.id);
            // Make the slot available again
            db.prepare("UPDATE slots SET available = 1 WHERE id = ?").run(booking.slot_id);
            db.exec('COMMIT');
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }

        const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as unknown as DbBooking;
        res.json(mapBooking(updated));
    } catch (err) {
        console.error('PATCH /bookings/:id/cancel error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
