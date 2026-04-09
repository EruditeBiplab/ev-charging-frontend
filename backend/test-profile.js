// test-profile.js — tests GET and PUT /api/auth/me
(async () => {
  const login = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_new@ev.com', password: 'password123' })
  });
  if (!login.ok) { console.error('Login failed', await login.text()); return; }
  const { token, user } = await login.json();
  console.log('Token obtained for:', user.name);

  // Test GET /me
  const me = await fetch('http://localhost:4000/api/auth/me', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const meData = await me.json();
  console.log('GET /me status:', me.status, '→', JSON.stringify(meData));

  // Test PUT /me
  const upd = await fetch('http://localhost:4000/api/auth/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ name: 'Test User Updated', phone: '+91 99999 00001' })
  });
  const updData = await upd.json();
  console.log('PUT /me status:', upd.status, '→', JSON.stringify(updData));
  console.log(upd.ok ? '✅ Profile endpoints working!' : '❌ Failed');
})();
