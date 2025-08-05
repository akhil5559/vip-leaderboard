import { SlashCommandBuilder } from 'discord.js';
import Player from '../services/mongo.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Unlink your Clash of Clans account from leaderboard'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;

    try {
      const result = await Player.updateMany(
        { discord_id: userId },
        { $unset: { discord_id: '' } }
      );

      if (result.modifiedCount > 0) {
        return interaction.editReply('✅ Your account has been unlinked from the leaderboard.');
      } else {
        return interaction.editReply('⚠️ No linked account found.');
      }
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Failed to unlink. Try again later.');
    }
  }
};
