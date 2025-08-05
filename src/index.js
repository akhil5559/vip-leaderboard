import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToMongo } from './services/mongo.js';
import './jobs/refreshPlayers.js';
import './jobs/dailyReset.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const slashCommands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(`./commands/${file}`)).default;
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());
  }
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: slashCommands },
).then(() => console.log('✅ Slash commands registered.'));

// Event: Interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
  }
});

// Start
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

connectToMongo().then(() => {
  client.login(process.env.BOT_TOKEN);
});
