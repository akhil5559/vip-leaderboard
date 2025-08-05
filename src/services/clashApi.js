import fetch from 'node-fetch';

const BASE_URL = process.env.COC_PROXY;

export async function fetchPlayer(tag) {
  try {
    const url = `${BASE_URL}/players/%23${tag.replace('#', '')}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      player_tag: data.tag.replace('#', ''),
      name: data.name,
      trophies: data.trophies
    };
  } catch (err) {
    console.error(`❌ Error fetching player ${tag}:`, err);
    return null;
  }
}
