import cron from 'cron';
import Player from '../services/mongo.js';
import { fetchPlayer } from '../services/clashApi.js';
import { logInfo } from '../services/logger.js';

const job = new cron.CronJob('*/2 * * * *', async () => {
  try {
    const players = await Player.find({ discord_id: { $exists: true } });

    for (const player of players) {
      const freshData = await fetchPlayer(player.player_tag);
      if (!freshData) continue;

      const offenseTrophies = Math.max(freshData.trophies - player.prev_trophies, 0);
      const defenseTrophies = Math.max(player.prev_trophies - freshData.trophies, 0);

      await Player.updateOne(
        { player_tag: player.player_tag },
        {
          $set: {
            trophies: freshData.trophies,
            name: freshData.name,
            attacks: player.attacks,
            defenses: player.defenses,
            offense_trophies: offenseTrophies,
            defense_trophies: defenseTrophies
          }
        }
      );
    }

    logInfo(`✅ Refreshed ${players.length} player(s)`);
  } catch (err) {
    console.error('❌ Error in refreshPlayers job:', err);
  }
});

job.start();
