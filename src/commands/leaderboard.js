import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
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
    await interaction.deferReply();

    const title = interaction.options.getString('name') || '🏆 Trophy Leaderboard';
    const color = interaction.options.getString('color') || '#0099ff';

    const page = 0;
    const { players, totalPages } = await getPaginatedPlayers(page);
    const embed = getLeaderboardEmbed(players, title, color, page, totalPages);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`prev_page_${page}`)
        .setLabel('◀ Previous')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('refresh_leaderboard')
        .setLabel('🔄 Refresh')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`next_page_${page}`)
        .setLabel('Next ▶')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  }
};
