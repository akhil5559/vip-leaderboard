// src/utils/paginator.js

import Player from '../models/playerModel.js';

/**
 * Fetch paginated players from MongoDB sorted by trophies.
 *
 * @param {number} page - Page number (0-based)
 * @param {number} pageSize - Number of players per page
 * @returns {Object} players, totalPages
 */
export async function getPaginatedPlayers(page = 0, pageSize = 10) {
  try {
    const totalPlayers = await Player.countDocuments();
    const totalPages = Math.ceil(totalPlayers / pageSize);

    const players = await Player.find({})
      .sort({ trophies: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    return {
      players,
      totalPages
    };
  } catch (err) {
    console.error('❌ Pagination error:', err);
    return {
      players: [],
      totalPages: 0
    };
  }
}
