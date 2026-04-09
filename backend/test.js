// Test that createBooking returns correct field names matching frontend Booking type
const today = new Date().toISOString().split('T')[0];

(async () => {
  // Step 1: Register or login
  let token;
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_new@ev.com', password: 'password123' })
  });
  if (loginRes.ok) {
    token = (await loginRes.json()).token;
    console.log('Logged in ✅');
  } else {
    console.error('Login failed', await loginRes.text());
    return;
  }

  // Step 2: Get a slot for today
  const slotsRes = await fetch(`http://localhost:4000/api/slots?stationId=s1&date=${today}`);
  const slots = await slotsRes.json();
  const availableSlot = slots.find(s => s.available);
  if (!availableSlot) { console.error('No available slot'); return; }
  console.log('Using slot:', availableSlot.id, availableSlot.startTime);

  // Step 3: Create booking
  const bookRes = await fetch('http://localhost:4000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      stationId: 's1',
      slotId: availableSlot.id,
      stationName: 'ElectroPark Charging Hub',
      date: today,
      startTime: availableSlot.startTime,
      endTime: availableSlot.endTime,
      chargerType: availableSlot.chargerType,
      totalAmount: 280,
      paymentMethod: 'UPI'
    })
  });

  console.log('HTTP', bookRes.status);
  const booking = await bookRes.json();
  console.log('Booking response:', JSON.stringify(booking, null, 2));

  // Verify all required fields for frontend Booking type
  const required = ['id', 'userId', 'stationId', 'slotId', 'stationName', 'date', 'startTime', 'endTime', 'chargerType', 'totalAmount', 'status', 'paymentMethod', 'createdAt'];
  const missing = required.filter(f => !(f in booking));
  if (missing.length > 0) {
    console.error('❌ MISSING FIELDS:', missing);
  } else {
    console.log('✅ All required Booking fields present!');
  }
})();
