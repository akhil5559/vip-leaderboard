import fs from 'fs';
import path from 'path';

const logFile = path.join('logs.txt');

export function logError(msg) {
  const log = `[${new Date().toISOString()}] ERROR: ${msg}\n`;
  fs.appendFileSync(logFile, log);
}

export function logInfo(msg) {
  const log = `[${new Date().toISOString()}] INFO: ${msg}\n`;
  fs.appendFileSync(logFile, log);
}
