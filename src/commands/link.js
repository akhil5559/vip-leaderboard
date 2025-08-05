import { SlashCommandBuilder } from 'discord.js';
import { fetchPlayer } from '../services/clashApi.js';
import Player from '../services/mongo.js';

export default {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Clash of Clans account to your Discord')
