export function getLeaderboardEmbed(players, page, totalPages, name = 'Leaderboard', color = '#FFD700') {
  const start = (page - 1) * 10;
  const pagePlayers = players.slice(start, start + 10);

  const fields = pagePlayers.map((p, i) => {
    const rank = start + i + 1;
    return {
      name: `${rank}. ${p.name} (${p.player_tag})`,
      value: `<:trophy:1400826511799484476> ${p.trophies} | <:Offence:1400826628099014676> +${p.offense_trophies}/${p.offense_attacks ?? 0} | <:emoji_9:1252010455694835743> ${p.defense_trophies}/${p.defense_defenses ?? 0}`,
      inline: false
    };
  });

  return {
    title: name,
    color,
    fields,
    footer: {
      text: `Page ${page} of ${totalPages} • Last refreshed: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
    }
  };
}
