// src/utils/paginator.js

import Player from '../models/playerModel.js'; // Adjust path if needed

/**
 * Fetch paginated players from MongoDB for leaderboard.
 *
 * @param {number} page - The current page number (0-based).
 * @param {number} pageSize - Number of items per page.
 * @returns {Object} Contains the paginated data and pagination metadata.
 */
export async function getPaginatedPlayers(page = 0, pageSize = 10) {
  const skip = page * pageSize;

  const players = await Player.find()
    .sort({ trophies: -1 })
    .skip(skip)
    .limit(pageSize);

  const totalCount = await Player.countDocuments();
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    players,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0
  };
}
