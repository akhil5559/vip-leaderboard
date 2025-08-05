import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  player_tag: String,
  name: String,
  trophies: Number,
  prev_trophies: Number,
  rank: Number,
  prev_rank: Number,
  discord_id: String,
  attacks: Number,
  defenses: Number,
  offense_attacks: Number,
  offense_trophies: Number,
  defense_defenses: Number,
  defense_trophies: Number,
  last_reset: String
});

const Player = mongoose.model('Player', playerSchema);

export async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

export default Player;
