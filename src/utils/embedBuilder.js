import { EmbedBuilder } from 'discord.js';
import { EMOJI_TROPHY, EMOJI_OFFENSE, EMOJI_DEFENSE } from './emojis.js';

export function buildLeaderboardEmbed(players, page = 0, name = 'Leaderboard', color = '#FFD700') {
  const pageSize = 10;
  const totalPages = Math.ceil(players.length / pageSize);
  const pagedPlayers = players.slice(page * pageSize, (page + 1) * pageSize);

  const description = pagedPlayers.map((p, i) => {
    const rank = page * pageSize + i + 1;
    const offense = `+${p.offense_trophies}/${p.offense_attacks}`;
    const defense = `-${p.defense_trophies}/${p.defense_defenses}`;

    return `**${rank}. ${p.name} (#${p.player_tag})**\n` +
           `${EMOJI_TROPHY} ${p.trophies} | ${EMOJI_OFFENSE} ${offense} | ${EMOJI_DEFENSE} ${defense}`;
  }).join('\n\n');

  const embed = new EmbedBuilder()
    .setTitle(name)
    .setDescription(description || 'No players found.')
    .setColor(color)
    .setFooter({ text: `Last refreshed: ${new Date().toLocaleString('en-IN', {
      hour12: true, timeZone: 'Asia/Kolkata'
    })}` });

  return embed;
}
