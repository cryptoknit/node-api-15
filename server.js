import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8899;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, name: 'node-api-15' }));

app.listen(PORT, () => console.log('[node-api-15] listening on :' + PORT));