import express from 'express';
import './src/bot.js'; // <-- Start the bot

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Vip Leaderboard Bot is running...');
});

app.listen(PORT, () => {
  console.log(`🌐 Keep-alive server running on port ${PORT}`);
});
