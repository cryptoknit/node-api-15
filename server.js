import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const SERVICE = process.env.SERVICE_NAME || 'node-api-15';
const PORT = Number(process.env.PORT || 8899);

// Read version from package.json (if present)
let VERSION = '0.0.0';
try {
  const pkgPath = new URL('./package.json', import.meta.url);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  VERSION = pkg.version || VERSION;
} catch {}

/** root helps humans */
app.get('/', (_req, res) => {
  res.json({ ok: true, service: SERVICE, endpoints: ['/health', '/version', '/config', '/status'] });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, name: SERVICE });
});

app.get('/version', (_req, res) => {
  res.json({ ok: true, version: VERSION, service: SERVICE, timestamp: new Date().toISOString() });
});

app.get('/config', (_req, res) => {
  res.json({
    ok: true,
    service: SERVICE,
    port: PORT,
    env: {
      NODE_ENV: process.env.NODE_ENV || null,
      SERVICE_NAME: process.env.SERVICE_NAME || null,
    },
  });
});

app.get('/status', (_req, res) => {
  res.json({
    ok: true,
    uptime_sec: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid,
  });
});

const server = app.listen(PORT, () => console.log(`[${SERVICE}] listening on :${PORT}`));

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));

export default app;

