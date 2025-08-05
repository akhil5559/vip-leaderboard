import Player from './mongo.js';
import { fetchPlayerData } from './clash.js';
import { logInfo } from './logger.js';

export async function refreshAllPlayers() {
  const players = await Player.find();

  for (const p of players) {
    try {
      const latest = await fetchPlayerData(p.player_tag);

      const offenseTrophies = Math.max(latest.trophies - p.prev_trophies, 0);
      const defenseTrophies = Math.max(p.prev_trophies - latest.trophies, 0);

      await Player.updateOne(
        { player_tag: p.player_tag },
        {
          $set: {
            name: latest.name,
            trophies: latest.trophies,
            offense_attacks: offenseTrophies > 0 ? (p.offense_attacks || 0) + 1 : p.offense_attacks || 0,
            offense_trophies: (p.offense_trophies || 0) + offenseTrophies,
            defense_defenses: defenseTrophies > 0 ? (p.defense_defenses || 0) + 1 : p.defense_defenses || 0,
            defense_trophies: (p.defense_trophies || 0) + defenseTrophies,
          },
        }
      );
    } catch (err) {
      console.error(`❌ Failed to refresh ${p.player_tag}:`, err.message);
    }
  }

  logInfo(`✅ Refreshed data for ${players.length} players`);
}
