// keep_alive.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Required for ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start express server (for Render uptime)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`🌐 Keep-alive server running on port ${port}`);
});

// 👇 This is the critical line that actually starts your bot:
import './src/index.js'; // ✅ Corrected path
