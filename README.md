# Vip-leaderboard Bot

Clash of Clans Discord bot to track and display a trophy-based leaderboard for your server.

## Features

- Trophy leaderboard with offense/defense stats
- Link/unlink/remove CoC accounts
- Daily backup
- Auto-refresh player stats from proxy API
- Cool UI with buttons (refresh/next/prev)
- Stable & responsive (Render + UptimeRobot)

## Tech Stack

- Node.js + Discord.js v14
- MongoDB (with existing data)
- Render hosting
- Slash commands

## Setup

1. Clone the repo
2. Set environment variables in Render:
   - `BOT_TOKEN`
   - `MONGO_URI`
   - `CLASH_API_PROXY` (e.g., https://your-proxy/players/%23{tag})
3. Deploy to Render + ping with UptimeRobot
4. Enjoy!
