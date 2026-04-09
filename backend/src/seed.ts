import { DatabaseSync } from 'node:sqlite';

const SEED_KEY = 'stations_v1';

interface RawStation {
    id: string; name: string; address: string; city: string;
    distance: number; rating: number; reviewCount: number;
    availability: string; pricePerKwh: number; connectors: string[];
    amenities: string[]; lat: number; lng: number;
    totalPorts: number; availablePorts: number;
}

const stations: RawStation[] = [
    { id:'s1', name:'ElectroPark Charging Hub', address:'12, MG Road, Near Metro Station', city:'Bengaluru', distance:1.2, rating:4.8, reviewCount:234, availability:'Available', pricePerKwh:15, connectors:['CCS2','Type 2','CHAdeMO'], amenities:['WiFi','Restroom','Café','Parking'], lat:12.9716, lng:77.5946, totalPorts:8, availablePorts:6 },
    { id:'s2', name:'GreenVolt Station — Koramangala', address:'47, 5th Block, Koramangala', city:'Bengaluru', distance:2.5, rating:4.5, reviewCount:178, availability:'Few Slots', pricePerKwh:14, connectors:['CCS2','Type 2'], amenities:['WiFi','Parking'], lat:12.9352, lng:77.6245, totalPorts:6, availablePorts:2 },
    { id:'s3', name:'ChargePlus — Indiranagar', address:'100 Feet Road, Indiranagar', city:'Bengaluru', distance:3.1, rating:4.2, reviewCount:95, availability:'Available', pricePerKwh:16, connectors:['CCS2','CHAdeMO'], amenities:['Restroom','Parking'], lat:12.9784, lng:77.6408, totalPorts:4, availablePorts:3 },
    { id:'s4', name:'BESCOM Fast Charge — Whitefield', address:'ITPL Main Road, Whitefield', city:'Bengaluru', distance:4.8, rating:4.6, reviewCount:312, availability:'Available', pricePerKwh:13, connectors:['CCS2','Type 2','GB/T'], amenities:['WiFi','Restroom','Parking','Food Court'], lat:12.9698, lng:77.7500, totalPorts:12, availablePorts:9 },
    { id:'s5', name:'Volt Express — HSR Layout', address:'27th Main, HSR Layout Sector 2', city:'Bengaluru', distance:5.3, rating:3.9, reviewCount:67, availability:'Full', pricePerKwh:15, connectors:['Type 2'], amenities:['Parking'], lat:12.9116, lng:77.6389, totalPorts:4, availablePorts:0 },
    { id:'s6', name:'EV Hub — Electronic City', address:'Phase 1, Electronic City', city:'Bengaluru', distance:7.2, rating:4.4, reviewCount:145, availability:'Available', pricePerKwh:12, connectors:['CCS2','CHAdeMO','Type 2'], amenities:['WiFi','Restroom','Parking'], lat:12.8452, lng:77.6602, totalPorts:10, availablePorts:7 },
    { id:'s7', name:'PowerGrid Charge Point — Marathahalli', address:'Outer Ring Road, Marathahalli', city:'Bengaluru', distance:6.0, rating:4.1, reviewCount:89, availability:'Few Slots', pricePerKwh:14, connectors:['CCS2','Type 2'], amenities:['Parking','Restroom'], lat:12.9591, lng:77.6974, totalPorts:6, availablePorts:1 },
    { id:'s8', name:'AmpCharge — JP Nagar', address:'6th Phase, JP Nagar', city:'Bengaluru', distance:9.1, rating:4.7, reviewCount:203, availability:'Available', pricePerKwh:15, connectors:['CCS2','Type 2','CHAdeMO'], amenities:['WiFi','Restroom','Café','Parking'], lat:12.8912, lng:77.5912, totalPorts:8, availablePorts:5 },
];

interface RawSlot {
    stationId: string; date: string; startTime: string; endTime: string;
    chargerType: string; available: boolean; pricePerKwh: number;
}

function buildSlots(): RawSlot[] {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const d0 = fmt(today);
    const d1 = fmt(new Date(today.getTime() + 86400000));
    const d2 = fmt(new Date(today.getTime() + 2 * 86400000));
    const d3 = fmt(new Date(today.getTime() + 3 * 86400000));

    return [
        // s1
        { stationId:'s1', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d0, startTime:'09:00', endTime:'10:00', chargerType:'Fast', available:false, pricePerKwh:18 },
        { stationId:'s1', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d0, startTime:'11:00', endTime:'12:00', chargerType:'Standard', available:true, pricePerKwh:15 },
        { stationId:'s1', date:d0, startTime:'12:00', endTime:'13:00', chargerType:'Standard', available:false, pricePerKwh:15 },
        { stationId:'s1', date:d0, startTime:'14:00', endTime:'15:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d0, startTime:'15:00', endTime:'16:00', chargerType:'Standard', available:true, pricePerKwh:15 },
        { stationId:'s1', date:d0, startTime:'16:00', endTime:'17:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d1, startTime:'09:00', endTime:'10:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d1, startTime:'10:00', endTime:'11:00', chargerType:'Standard', available:true, pricePerKwh:15 },
        { stationId:'s1', date:d1, startTime:'11:00', endTime:'12:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d2, startTime:'08:00', endTime:'09:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s1', date:d2, startTime:'13:00', endTime:'14:00', chargerType:'Standard', available:true, pricePerKwh:15 },
        { stationId:'s1', date:d3, startTime:'10:00', endTime:'11:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        // s2
        { stationId:'s2', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Standard', available:true, pricePerKwh:14 },
        { stationId:'s2', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Standard', available:false, pricePerKwh:14 },
        { stationId:'s2', date:d0, startTime:'12:00', endTime:'13:00', chargerType:'Fast', available:true, pricePerKwh:17 },
        { stationId:'s2', date:d1, startTime:'09:00', endTime:'10:00', chargerType:'Standard', available:true, pricePerKwh:14 },
        { stationId:'s2', date:d1, startTime:'11:00', endTime:'12:00', chargerType:'Fast', available:true, pricePerKwh:17 },
        // s3
        { stationId:'s3', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Standard', available:true, pricePerKwh:16 },
        { stationId:'s3', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Fast', available:true, pricePerKwh:19 },
        { stationId:'s3', date:d0, startTime:'14:00', endTime:'15:00', chargerType:'Standard', available:false, pricePerKwh:16 },
        { stationId:'s3', date:d1, startTime:'09:00', endTime:'10:00', chargerType:'Fast', available:true, pricePerKwh:19 },
        { stationId:'s3', date:d2, startTime:'11:00', endTime:'12:00', chargerType:'Standard', available:true, pricePerKwh:16 },
        // s4
        { stationId:'s4', date:d0, startTime:'07:00', endTime:'08:00', chargerType:'Fast', available:true, pricePerKwh:16 },
        { stationId:'s4', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Fast', available:true, pricePerKwh:16 },
        { stationId:'s4', date:d0, startTime:'09:00', endTime:'10:00', chargerType:'Standard', available:true, pricePerKwh:13 },
        { stationId:'s4', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Fast', available:false, pricePerKwh:16 },
        { stationId:'s4', date:d1, startTime:'08:00', endTime:'09:00', chargerType:'Fast', available:true, pricePerKwh:16 },
        { stationId:'s4', date:d1, startTime:'12:00', endTime:'13:00', chargerType:'Standard', available:true, pricePerKwh:13 },
        // s5
        { stationId:'s5', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Standard', available:false, pricePerKwh:15 },
        { stationId:'s5', date:d1, startTime:'10:00', endTime:'11:00', chargerType:'Standard', available:false, pricePerKwh:15 },
        { stationId:'s5', date:d2, startTime:'08:00', endTime:'09:00', chargerType:'Standard', available:true, pricePerKwh:15 },
        // s6
        { stationId:'s6', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Fast', available:true, pricePerKwh:15 },
        { stationId:'s6', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Standard', available:true, pricePerKwh:12 },
        { stationId:'s6', date:d0, startTime:'12:00', endTime:'13:00', chargerType:'Fast', available:true, pricePerKwh:15 },
        { stationId:'s6', date:d1, startTime:'09:00', endTime:'10:00', chargerType:'Standard', available:true, pricePerKwh:12 },
        // s7
        { stationId:'s7', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Standard', available:false, pricePerKwh:14 },
        { stationId:'s7', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Fast', available:false, pricePerKwh:17 },
        { stationId:'s7', date:d1, startTime:'09:00', endTime:'10:00', chargerType:'Standard', available:true, pricePerKwh:14 },
        // s8
        { stationId:'s8', date:d0, startTime:'08:00', endTime:'09:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s8', date:d0, startTime:'10:00', endTime:'11:00', chargerType:'Standard', available:true, pricePerKwh:15 },
        { stationId:'s8', date:d0, startTime:'14:00', endTime:'15:00', chargerType:'Fast', available:true, pricePerKwh:18 },
        { stationId:'s8', date:d1, startTime:'11:00', endTime:'12:00', chargerType:'Standard', available:true, pricePerKwh:15 },
    ];
}

export function seedDatabase(db: DatabaseSync) {
    const alreadySeeded = db.prepare('SELECT value FROM _seed_meta WHERE key = ?').get(SEED_KEY);
    if (alreadySeeded) return;

    const insertStation = db.prepare(`
        INSERT OR IGNORE INTO stations
          (id, name, address, city, distance, rating, review_count, availability,
           price_per_kwh, connectors, amenities, lat, lng, total_ports, available_ports)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSlot = db.prepare(`
        INSERT OR IGNORE INTO slots
          (id, station_id, date, start_time, end_time, charger_type, available, price_per_kwh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMeta = db.prepare('INSERT OR IGNORE INTO _seed_meta (key, value) VALUES (?, ?)');

    db.exec('BEGIN TRANSACTION');
    try {
        for (const s of stations) {
            insertStation.run(
                s.id, s.name, s.address, s.city, s.distance, s.rating, s.reviewCount,
                s.availability, s.pricePerKwh,
                JSON.stringify(s.connectors), JSON.stringify(s.amenities),
                s.lat, s.lng, s.totalPorts, s.availablePorts,
            );
        }

        const rawSlots = buildSlots();
        rawSlots.forEach((slot, i) => {
            insertSlot.run(
                `slot-${i + 1}`,
                slot.stationId, slot.date, slot.startTime, slot.endTime,
                slot.chargerType, slot.available ? 1 : 0, slot.pricePerKwh,
            );
        });

        insertMeta.run(SEED_KEY, new Date().toISOString());
        db.exec('COMMIT');
    } catch (err) {
        db.exec('ROLLBACK');
        throw err;
    }

    console.log('✅ Database seeded');
}
