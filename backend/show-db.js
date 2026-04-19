const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('ev_charging.db');

// Get actual schema
const bookingCols = db.prepare("PRAGMA table_info(bookings)").all();
const userCols    = db.prepare("PRAGMA table_info(users)").all();
const stationCols = db.prepare("PRAGMA table_info(stations)").all();

console.log('\n📋 BOOKING TABLE COLUMNS:', bookingCols.map(c => c.name).join(', '));
console.log('👤 USER TABLE COLUMNS   :', userCols.map(c => c.name).join(', '));
console.log('🏠 STATION TABLE COLUMNS:', stationCols.map(c => c.name).join(', '));

// ── USERS ────────────────────────────────────────────────
console.log('\n\n========== 👤 USERS ==========');
const users = db.prepare('SELECT id, name, email, phone FROM users').all();
console.table(users);

// ── BOOKINGS (all columns auto-detected) ────────────────
const bCols = bookingCols.map(c => c.name).join(', ');
console.log('\n\n========== 📅 BOOKINGS ==========');
const bookings = db.prepare(`SELECT ${bCols} FROM bookings ORDER BY created_at DESC`).all();
console.table(bookings);

console.log('\n\n========== ⚡ STATIONS ==========');
const stCols = stationCols.map(c => c.name).join(', ');
console.log('Station columns:', stCols);
const stations = db.prepare('SELECT * FROM stations').all();
console.table(stations.map(s => ({ id: s.id, name: s.name, city: s.city || s.address || '—', slots: s.totalSlots || s.total_slots || '—' })));

console.log('\n\n📊 SUMMARY');
console.log(`   Users     : ${users.length}`);
console.log(`   Bookings  : ${bookings.length}`);
console.log(`   Stations  : ${stations.length}`);
