import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectToMongo } from './services/mongo.js';
import { scheduleDailyReset, scheduleRefreshJob } from './jobs/dailyReset.js';
import '../keep_alive.js';

async function main() {
  config();

  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.commands = new Collection();

  const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
  }

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
      } else {
        const handler = await import('./commands/leaderboard.js');
        await handler.handleButton(interaction);
      }
    } catch (err) {
      console.error('❌ Command error:', err);
      if (interaction.replied || interaction.deferred) {
        interaction.editReply({ content: 'An error occurred.' });
      } else {
        interaction.reply({ content: 'An error occurred.', ephemeral: true });
      }
    }
  });

  client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
    scheduleRefreshJob();
    scheduleDailyReset();
  });

  await connectToMongo();
  client.login(process.env.BOT_TOKEN);
}

main().catch(err => {
  console.error('❌ Uncaught Error:', err);
});
