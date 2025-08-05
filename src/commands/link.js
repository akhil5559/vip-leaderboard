import { SlashCommandBuilder } from 'discord.js';
import { fetchPlayer } from '../services/clashApi.js';
import Player from '../services/mongo.js';

export default {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Clash of Clans account to your Discord')
    .addStringOption(opt =>
      opt.setName('tag')
        .setDescription('Your Clash of Clans player tag (e.g., #ABCD1234)')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const tag = interaction.options.getString('tag').toUpperCase().replace('#', '');
    const userId = interaction.user.id;

    try {
      const player = await fetchPlayer(tag);

      if (!player) {
        return interaction.editReply('❌ Invalid player tag or not found.');
      }

      await Player.updateOne(
        { player_tag: tag },
        {
          $set: {
            player_tag: tag,
            discord_id: userId,
            name: player.name,
            trophies: player.trophies,
            prev_trophies: player.trophies,
            last_reset: new Date().toISOString().slice(0, 10),
          }
        },
        { upsert: true }
      );

      return interaction.editReply(`✅ Linked **${player.name}** (\`#${tag}\`) to your Discord.`);
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Failed to link. Please try again later.');
    }
  }
};
