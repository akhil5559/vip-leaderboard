export async function fetchPlayerData(tag) {
  try {
    const encodedTag = encodeURIComponent(tag.startsWith('#') ? tag : `#${tag}`);
    const url = `https://clash-of-clans-api-4bi0.onrender.com/player/${encodedTag}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Failed to fetch data for ${tag}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return {
      name: data.name,
      trophies: data.trophies
    };
  } catch (err) {
    console.error(`❌ Error fetching data for ${tag}:`, err);
    return null;
  }
}
