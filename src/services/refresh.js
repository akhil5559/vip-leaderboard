import Player from './mongo.js';
import { fetchPlayerData } from './clash.js';
import { logInfo, logError } from './logger.js';

export async function refreshPlayerData() {
  try {
    const allPlayers = await Player.find();

    for (const player of allPlayers) {
      const data = await fetchPlayerData(player.player_tag);
      if (!data) {
        logError(`⚠️ Failed to fetch data for ${player.player_tag}`);
        continue;
      }

      const updatedFields = {
        name: data.name,
        trophies: data.trophies,
        rank: 0 // will be set during ranking logic if needed
      };

      // Calculate offense
      const offenseDiff = data.trophies - player.trophies;
      if (offenseDiff > 0) {
        updatedFields.offense_attacks = (player.offense_attacks || 0) + 1;
        updatedFields.offense_trophies = (player.offense_trophies || 0) + offenseDiff;
      }

      // Calculate defense
      if (offenseDiff < 0) {
        updatedFields.defense_defenses = (player.defense_defenses || 0) + 1;
        updatedFields.defense_trophies = (player.defense_trophies || 0) + Math.abs(offenseDiff);
      }

      await Player.updateOne({ player_tag: player.player_tag }, { $set: updatedFields });
    }

    logInfo(`✅ Refreshed ${allPlayers.length} players`);
  } catch (err) {
    logError('❌ Error in refreshPlayerData:', err);
  }
}
