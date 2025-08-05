// src/utils/paginator.js

/**
 * Paginate the players array for leaderboard display.
 *
 * @param {Array} players - The full array of player objects.
 * @param {number} page - The current page number (1-based).
 * @param {number} pageSize - Number of items per page.
 * @returns {Object} Contains the paginated data and pagination metadata.
 */
export function getPaginatedPlayers(players, page = 1, pageSize = 10) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginated = players.slice(startIndex, endIndex);

  return {
    data: paginated,
    totalPages: Math.ceil(players.length / pageSize),
    currentPage: page,
    hasNextPage: endIndex < players.length,
    hasPreviousPage: startIndex > 0
  };
}
