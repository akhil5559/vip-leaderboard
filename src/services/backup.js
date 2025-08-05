import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  data: [Object]
});

const Backup = mongoose.model('Backup', backupSchema);

export async function createBackup(players) {
  try {
    await Backup.create({ data: players });
    console.log('🗂️ MongoDB backup created');
  } catch (err) {
    console.error('❌ Backup failed:', err);
  }
}
