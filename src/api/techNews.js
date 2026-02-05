export const NEWSDATA_TECH_URL =
  'https://newsdata.io/api/1/latest?apikey=pub_8939c602d85f46eca000141a84e28b52&q=tech%20news';

/**
 * Fetch latest tech news from NewsData.io.
 * Returns the raw JSON response.
 */
export async function fetchTechNews({ signal } = {}) {
  const res = await fetch(NEWSDATA_TECH_URL, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load tech news (${res.status})`);
  }
  return await res.json();
}

