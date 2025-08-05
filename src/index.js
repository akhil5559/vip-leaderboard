// src/index.js
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectToMongo } from './services/mongo.js';
import { scheduleDailyReset, scheduleRefreshJob } from './jobs/dailyReset.js';
import '../keep_alive.js'; // Keeps the bot alive on Render

config(); // Load .env at the top

async function main() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.commands = new Collection();

  // Load all slash commands
  const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
  }

  // Handle interactions
  client.on('interactionCreate', async interaction => {
    try {
      // Slash command
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
      }

      // Button interaction
      else if (interaction.isButton()) {
        if (interaction.customId.startsWith('leaderboard_')) {
          const handler = await import('./commands/leaderboard.js');
          await handler.handleButton(interaction);
        }
      }
    } catch (err) {
      console.error('❌ Command error:', err);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content: 'An error occurred.' });
      } else {
        await interaction.reply({ content: 'An error occurred.', ephemeral: true });
      }
    }
  });

  client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    scheduleRefreshJob();
    scheduleDailyReset();
  });

  await connectToMongo();
  await client.login(process.env.DISCORD_TOKEN); // 🔑 Make sure DISCORD_TOKEN is correct
}

main().catch(err => {
  console.error('❌ Uncaught Error:', err);
});
