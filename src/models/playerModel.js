// src/models/playerModel.js
import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  tag: { type: String, required: true, unique: true },
  name: String,
  trophies: Number,
  clan: String,
  lastUpdated: Date
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
