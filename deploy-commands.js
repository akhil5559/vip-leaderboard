// deploy-commands.js
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';

config();

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Load each command's JSON data
for (const file of commandFiles) {
  const command = await import(`./src/commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Register global commands
(async () => {
  try {
    console.log('🚀 Deploying slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
})();
