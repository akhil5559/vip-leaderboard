import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Player from '../services/mongo.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a player from the leaderboard (admin only)')
    .addStringOption(opt =>
      opt.setName('tag')
        .setDescription('Player tag to remove (e.g., #TAG123)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const tag = interaction.options.getString('tag').toUpperCase().replace('#', '');

    try {
      const result = await Player.updateOne(
        { player_tag: tag },
        { $unset: { discord_id: '' } }
      );

      if (result.modifiedCount > 0) {
        return interaction.editReply(`✅ Player \`#${tag}\` has been removed from the leaderboard.`);
      } else {
        return interaction.editReply(`⚠️ Player \`#${tag}\` not found or already removed.`);
      }
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Failed to remove player.');
    }
  }
};
