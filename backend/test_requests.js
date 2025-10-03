// backend/test_requests.js
// Script de integração rápido para testar endpoints locais

require('dotenv').config();
const http = require('http');
const https = require('https');
const jwt = require('jsonwebtoken');

const HOST = 'localhost';
const PORT = process.env.PORT || 3001;
const API = `/api`;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('PORT used by script:', PORT);

    // Generate a JWT using server secret (acts as admin token)
    const token = jwt.sign({ user: process.env.ADMIN_USER || 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    console.log('Generated token (first 32 chars):', token.slice(0, 32) + '...');

    // 1) Health
    let res = await request({ hostname: HOST, port: PORT, path: `${API}/health`, method: 'GET' });
    console.log('\n[HEALTH] status=', res.status, 'body=', res.body);

    // 2) GET /projetos
    res = await request({ hostname: HOST, port: PORT, path: `${API}/projetos`, method: 'GET' });
    console.log('\n[GET /projetos] status=', res.status, 'body=', res.body);

    // 3) GET /esportes
    res = await request({ hostname: HOST, port: PORT, path: `${API}/esportes`, method: 'GET' });
    console.log('\n[GET /esportes] status=', res.status, 'body=', res.body);

    // 4) POST /projetos (create)
  // Use the mapped fields expected by the Supabase schema
  const newProject = { nome: 'Projeto Teste (script)', descricao_completa: 'Criado por script de testes', imagem_url: 'https://example.test' };
    res = await request({ hostname: HOST, port: PORT, path: `${API}/projetos`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }, JSON.stringify(newProject));
    console.log('\n[POST /projetos] status=', res.status, 'body=', res.body);

    let created;
    try { created = JSON.parse(res.body); } catch(e) { created = res.body; }

    // If created returned an object with id (Supabase returns the object), extract id
    let createdId = null;
    if (created && typeof created === 'object') {
      if (created.id) createdId = created.id;
      else if (Array.isArray(created) && created.length && created[0].id) createdId = created[0].id;
      else if (created.data && created.data.id) createdId = created.data.id;
    }
    console.log('CreatedId=', createdId);

    if (createdId) {
      // 5) PUT /projetos/:id
  const updated = { nome: 'Projeto Teste (script) - atualizado', descricao_completa: 'Atualizado por script' };
      res = await request({ hostname: HOST, port: PORT, path: `${API}/projetos/${createdId}`, method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }, JSON.stringify(updated));
      console.log('\n[PUT /projetos/:id] status=', res.status, 'body=', res.body);

      // 6) DELETE /projetos/:id
      res = await request({ hostname: HOST, port: PORT, path: `${API}/projetos/${createdId}`, method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      console.log('\n[DELETE /projetos/:id] status=', res.status, 'body=', res.body);
    } else {
      console.log('\n[SKIP] create returned no id; skipping update/delete steps');
    }

    console.log('\nAll done.');
  } catch (err) {
    console.error('Script error:', err.message || err);
    process.exit(1);
  }
})();
