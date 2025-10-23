// BestLive minimal Express server
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'data', 'bestlive.db');
const ICECAST_URL = process.env.ICECAST_PUBLIC_URL || 'http://localhost:8000';

async function initDb(){
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT, email TEXT, created_at INTEGER
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY, user_id TEXT, name TEXT, mountpoint TEXT, source_password TEXT, created_at INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  return db;
}

let dbPromise = initDb();

// helper: sanitize mountpoint
function mkMountpoint(name){
  const safe = name.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0,24);
  return '/' + safe + '-' + Math.random().toString(36).slice(2,8);
}

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const db = await dbPromise;
    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (id, username, password_hash, email, created_at) VALUES (?, ?, ?, ?, ?)',
      id, username, password_hash, email||'', Date.now());
    return res.json({ ok: true, id });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if(!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ error: 'invalid credentials' });
    // NOTE: minimal session: return user id (for demo). Replace with JWT in production.
    return res.json({ ok: true, id: user.id, username: user.username });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/create-station', async (req, res) => {
  try {
    const { user_id, name } = req.body;
    if(!user_id || !name) return res.status(400).json({ error: 'user_id and name required' });
    const db = await dbPromise;
    // ensure user exists
    const user = await db.get('SELECT * FROM users WHERE id = ?', user_id);
    if(!user) return res.status(404).json({ error: 'user not found' });
    const id = uuidv4();
    const mountpoint = mkMountpoint(name);
    const source_password = crypto.randomBytes(6).toString('hex');
    await db.run('INSERT INTO stations (id, user_id, name, mountpoint, source_password, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      id, user_id, name, mountpoint, source_password, Date.now());
    // Return connection details for Butt/Winamp:
    const details = {
      server: ICECAST_URL.replace(/\/$/, ''),
      port: 8000,
      mountpoint,
      source_password,
      listen_url: ICECAST_URL.replace(/\/$/, '') + mountpoint
    };
    return res.json({ ok: true, station_id: id, details });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.get('/api/stations', async (req, res) => {
  try {
    const { user_id } = req.query;
    const db = await dbPromise;
    if(!user_id) return res.status(400).json({ error: 'user_id required' });
    const rows = await db.all('SELECT id,name,mountpoint,created_at FROM stations WHERE user_id = ?', user_id);
    return res.json({ ok:true, stations: rows });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

app.get('/api/station/:id', async (req,res)=>{
  try{
    const db = await dbPromise;
    const s = await db.get('SELECT id,user_id,name,mountpoint,source_password,created_at FROM stations WHERE id = ?', req.params.id);
    if(!s) return res.status(404).json({ error: 'not found' });
    s.icecast = {
      server: ICECAST_URL.replace(/\/$/, ''),
      port: 8000,
      listen_url: ICECAST_URL.replace(/\/$/, '') + s.mountpoint
    };
    res.json({ ok:true, station: s });
  }catch(e){
    console.error(e); res.status(500).json({ error: e.message});
  }
});

// Serve a minimal single-page app
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log('BestLive web listening on', port));
