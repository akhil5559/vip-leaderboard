import cron from 'node-cron';
import Player from '../services/mongo.js';
import { createBackup } from '../services/backup.js';
import { logInfo } from '../services/logger.js';
import { refreshPlayerData } from '../services/refresh.js'; // optional if needed

export function scheduleDailyReset() {
  cron.schedule('0 0 10 * * *', async () => {
    try {
      const allPlayers = await Player.find();

      for (const p of allPlayers) {
        await Player.updateOne(
          { player_tag: p.player_tag },
          {
            $set: {
              prev_trophies: p.trophies,
              prev_rank: p.rank,
              offense_attacks: 0,
              offense_trophies: 0,
              defense_defenses: 0,
              defense_trophies: 0,
              last_reset: new Date().toISOString().slice(0, 10)
            }
          }
        );
      }

      await createBackup(allPlayers);
      logInfo(`📦 Daily reset complete for ${allPlayers.length} players`);
    } catch (err) {
      console.error('❌ Error in daily reset:', err);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
}

export function scheduleRefreshJob() {
  cron.schedule('*/2 * * * *', async () => {
    try {
      await refreshPlayerData(); // optional: refresh logic
      logInfo('🔄 Player data refreshed');
    } catch (err) {
      console.error('❌ Error in refresh job:', err);
    }
  });
}
