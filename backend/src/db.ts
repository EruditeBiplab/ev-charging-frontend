// backend/src/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import { seedDatabase } from './seed';

const DB_PATH = path.join(__dirname, '..', 'ev_charging.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!_db) {
        _db = new Database(DB_PATH);
        _db.exec('PRAGMA journal_mode = WAL');
        _db.exec('PRAGMA foreign_keys = ON');
        initSchema(_db);
        seedDatabase(_db);
    }
    return _db;
}

function initSchema(db: Database.Database) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            email       TEXT NOT NULL UNIQUE,
            phone       TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS stations (
            id              TEXT PRIMARY KEY,
            name            TEXT NOT NULL,
            address         TEXT NOT NULL,
            city            TEXT NOT NULL,
            distance        REAL NOT NULL,
            rating          REAL NOT NULL,
            review_count    INTEGER NOT NULL DEFAULT 0,
            availability    TEXT NOT NULL DEFAULT 'Available',
            price_per_kwh   REAL NOT NULL,
            connectors      TEXT NOT NULL,
            amenities       TEXT NOT NULL,
            lat             REAL NOT NULL,
            lng             REAL NOT NULL,
            total_ports     INTEGER NOT NULL DEFAULT 0,
            available_ports INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS slots (
            id              TEXT PRIMARY KEY,
            station_id      TEXT NOT NULL REFERENCES stations(id),
            date            TEXT NOT NULL,
            start_time      TEXT NOT NULL,
            end_time        TEXT NOT NULL,
            charger_type    TEXT NOT NULL,
            available       INTEGER NOT NULL DEFAULT 1,
            price_per_kwh   REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id              TEXT PRIMARY KEY,
            user_id         TEXT NOT NULL REFERENCES users(id),
            station_id      TEXT NOT NULL REFERENCES stations(id),
            slot_id         TEXT NOT NULL REFERENCES slots(id),
            station_name    TEXT NOT NULL,
            date            TEXT NOT NULL,
            start_time      TEXT NOT NULL,
            end_time        TEXT NOT NULL,
            charger_type    TEXT NOT NULL,
            total_amount    REAL NOT NULL,
            status          TEXT NOT NULL DEFAULT 'Confirmed',
            payment_method  TEXT NOT NULL,
            created_at      TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS _seed_meta (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    `);
}