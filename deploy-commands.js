// deploy-commands.js
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';

config();

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./src/commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands...');

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log('✅ Successfully reloaded application (/) commands!');
} catch (error) {
  console.error('❌ Error deploying commands:', error);
}
