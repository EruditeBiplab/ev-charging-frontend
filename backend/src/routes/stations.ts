// backend/src/routes/stations.ts
import { Router, Request, Response } from 'express';
import { getDb } from '../db';

const router = Router();

interface DbStation {
    id: string; name: string; address: string; city: string;
    distance: number; rating: number; review_count: number;
    availability: string; price_per_kwh: number;
    connectors: string; amenities: string;
    lat: number; lng: number;
    total_ports: number; available_ports: number;
}

function mapStation(row: DbStation) {
    return {
        id: row.id,
        name: row.name,
        address: row.address,
        city: row.city,
        distance: row.distance,
        rating: row.rating,
        reviewCount: row.review_count,
        availability: row.availability,
        pricePerKwh: row.price_per_kwh,
        connectors: JSON.parse(row.connectors) as string[],
        amenities: JSON.parse(row.amenities) as string[],
        lat: row.lat,
        lng: row.lng,
        totalPorts: row.total_ports,
        availablePorts: row.available_ports,
    };
}

// GET /api/stations?query=&sortBy=distance|price|rating&fastCharging=true
router.get('/', (req: Request, res: Response) => {
    try {
        const query = ((req.query.query as string) || '').toLowerCase().trim();
        const sortBy = (req.query.sortBy as string) || '';
        const fastCharging = req.query.fastCharging === 'true';

        const db = getDb();
        let rows = db.prepare('SELECT * FROM stations').all() as unknown as DbStation[];

        // Text filter
        if (query) {
            rows = rows.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.city.toLowerCase().includes(query) ||
                s.address.toLowerCase().includes(query)
            );
        }

        // Fast charging filter — has CCS or CHAdeMO connector
        if (fastCharging) {
            rows = rows.filter(s => {
                const connectors = JSON.parse(s.connectors) as string[];
                return connectors.some(c => c.toLowerCase().includes('ccs') || c.toLowerCase().includes('chad'));
            });
        }

        // Sort
        if (sortBy === 'distance') rows.sort((a, b) => a.distance - b.distance);
        else if (sortBy === 'price') rows.sort((a, b) => a.price_per_kwh - b.price_per_kwh);
        else if (sortBy === 'rating') rows.sort((a, b) => b.rating - a.rating);

        res.json(rows.map(mapStation));
    } catch (err) {
        console.error('GET /stations error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/stations/:id
router.get('/:id', (req: Request, res: Response) => {
    try {
        const db = getDb();
        const row = db.prepare('SELECT * FROM stations WHERE id = ?').get(req.params.id) as unknown as DbStation | undefined;
        if (!row) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }
        res.json(mapStation(row));
    } catch (err) {
        console.error('GET /stations/:id error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
