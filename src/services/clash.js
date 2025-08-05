// src/services/clash.js
import fetch from 'node-fetch';

const BASE_URL = 'https://clash-of-clans-api-4bi0.onrender.com';

export async function fetchPlayerData(tag) {
  try {
    const encodedTag = encodeURIComponent(tag);
    const res = await fetch(`${BASE_URL}/player/${encodedTag}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Error fetching data for ${tag}:`, err);
    return null;
  }
}
