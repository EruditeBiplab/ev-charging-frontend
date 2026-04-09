// backend/src/routes/slots.ts
import { Router, Request, Response } from 'express';
import { getDb } from '../db';

const router = Router();

interface DbSlot {
    id: string; station_id: string; date: string;
    start_time: string; end_time: string;
    charger_type: string; available: number; price_per_kwh: number;
}

function mapSlot(row: DbSlot) {
    return {
        id: row.id,
        stationId: row.station_id,
        date: row.date,
        startTime: row.start_time,
        endTime: row.end_time,
        chargerType: row.charger_type as 'Fast' | 'Standard',
        available: row.available === 1,
        pricePerKwh: row.price_per_kwh,
    };
}

// GET /api/slots?stationId=s1&date=2026-04-02
router.get('/', (req: Request, res: Response) => {
    try {
        const { stationId, date } = req.query as { stationId?: string; date?: string };
        if (!stationId || !date) {
            res.status(400).json({ error: 'stationId and date query params are required' });
            return;
        }
        const db = getDb();
        let rows = db.prepare(
            'SELECT * FROM slots WHERE station_id = ? AND date = ? ORDER BY start_time'
        ).all(stationId, date) as unknown as DbSlot[];

        // If no slots exist for this date (e.g. seed is stale), generate them on-the-fly
        if (rows.length === 0) {
            const station = db.prepare('SELECT price_per_kwh FROM stations WHERE id = ?').get(stationId) as unknown as
                { price_per_kwh: number } | undefined;

            if (station) {
                const basePrice = station.price_per_kwh;
                const timeBlocks = [
                    { start: '08:00', end: '09:00', type: 'Fast'     },
                    { start: '09:00', end: '10:00', type: 'Standard' },
                    { start: '10:00', end: '11:00', type: 'Fast'     },
                    { start: '11:00', end: '12:00', type: 'Standard' },
                    { start: '12:00', end: '13:00', type: 'Fast'     },
                    { start: '13:00', end: '14:00', type: 'Standard' },
                    { start: '14:00', end: '15:00', type: 'Fast'     },
                    { start: '15:00', end: '16:00', type: 'Standard' },
                    { start: '16:00', end: '17:00', type: 'Fast'     },
                    { start: '17:00', end: '18:00', type: 'Standard' },
                    { start: '18:00', end: '19:00', type: 'Fast'     },
                    { start: '19:00', end: '20:00', type: 'Standard' },
                ];

                const insertSlot = db.prepare(`
                    INSERT OR IGNORE INTO slots
                      (id, station_id, date, start_time, end_time, charger_type, available, price_per_kwh)
                    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                `);

                db.exec('BEGIN TRANSACTION');
                try {
                    timeBlocks.forEach((block, i) => {
                        const slotId = `dyn-${stationId}-${date}-${i}`;
                        const price = block.type === 'Fast' ? basePrice + 3 : basePrice;
                        insertSlot.run(slotId, stationId, date, block.start, block.end, block.type, price);
                    });
                    db.exec('COMMIT');
                } catch (err) {
                    db.exec('ROLLBACK');
                    throw err;
                }

                rows = db.prepare(
                    'SELECT * FROM slots WHERE station_id = ? AND date = ? ORDER BY start_time'
                ).all(stationId, date) as unknown as DbSlot[];
            }
        }

        res.json(rows.map(mapSlot));
    } catch (err) {
        console.error('GET /slots error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
