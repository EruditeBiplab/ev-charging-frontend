// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import stationsRouter from './routes/stations';
import slotsRouter from './routes/slots';
import bookingsRouter from './routes/bookings';

// Trigger DB init + seed on startup
import { getDb } from './db';
getDb();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// CORS — allow configured origins (Vercel URL set via env in production)
// ALLOWED_ORIGINS = comma-separated list, e.g. "https://ev-charge.vercel.app,http://localhost:5173"
const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim());
app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no origin (curl, Render health checks, same-origin proxy)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/slots', slotsRouter);
app.use('/api/bookings', bookingsRouter);

// 404 fallback
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`\n🚗⚡  EV Charging Backend running on http://localhost:${PORT}`);
    console.log(`   Health → http://localhost:${PORT}/api/health\n`);
});
