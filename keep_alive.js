import express from 'express';
import './src/index.js'; // ✅ Correct entry point

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(3000, () => {
  console.log('🌐 Keep-alive server running');
});
