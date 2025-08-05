// src/commands/leaderboard.js

import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { getLeaderboardEmbed } from '../utils/embedBuilder.js';
import { getPaginatedPlayers } from '../utils/paginator.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show Clash of Clans trophy leaderboard')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Title for the leaderboard')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('color')
        .setDescription('Embed color (HEX code like #ff0000)')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const title = interaction.options.getString('name') || '🏆 Trophy Leaderboard';
      const color = interaction.options.getString('color') || '#0099ff';

      // 👇 Replace this line
      // const { players, totalPages } = await getPaginatedPlayers(page);
      // 👇 With this corrected version
      const allPlayers = await getPlayersFromDB(); // you must implement this in your DB service
      const page = 1;
      const { data: players, totalPages } = getPaginatedPlayers(allPlayers, page);

      if (!players || players.length === 0) {
        return await interaction.editReply({
          content: '❌ No players found in the leaderboard.',
          ephemeral: true
        });
      }

      const embed = getLeaderboardEmbed(players, title, color, page, totalPages);

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`leaderboard_prev_${page}`)
          .setLabel('◀ Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`leaderboard_refresh_${page}`)
          .setLabel('🔄 Refresh')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`leaderboard_next_${page}`)
          .setLabel('Next ▶')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page >= totalPages)
      );

      await interaction.editReply({ embeds: [embed], components: [buttons] });

    } catch (err) {
      console.error('❌ Command error:', err);
      await interaction.editReply({ content: 'An error occurred while fetching leaderboard.' });
    }
  }
};

// 👇 Button Interaction Handler
export async function handleButton(interaction) {
  if (!interaction.isButton()) return;

  try {
    const [prefix, action, pageStr] = interaction.customId.split('_');
    if (prefix !== 'leaderboard') return;

    let page = parseInt(pageStr);
    if (isNaN(page)) page = 1;

    if (action === 'next') page++;
    else if (action === 'prev') page--;
    // refresh keeps same page

    const allPlayers = await getPlayersFromDB(); // again, replace with your actual DB call
    const { data: players, totalPages } = getPaginatedPlayers(allPlayers, page);

    if (!players || players.length === 0) {
      return await interaction.update({
        content: '❌ No players found.',
        components: [],
        embeds: []
      });
    }

    const embed = getLeaderboardEmbed(players, '🏆 Trophy Leaderboard', '#0099ff', page, totalPages);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`leaderboard_prev_${page}`)
        .setLabel('◀ Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page <= 1),
      new ButtonBuilder()
        .setCustomId(`leaderboard_refresh_${page}`)
        .setLabel('🔄 Refresh')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`leaderboard_next_${page}`)
        .setLabel('Next ▶')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page >= totalPages)
    );

    await interaction.update({ embeds: [embed], components: [buttons] });

  } catch (err) {
    console.error('❌ Button interaction error:', err);
    await interaction.reply({ content: 'An error occurred while handling the button.', ephemeral: true });
  }
}
