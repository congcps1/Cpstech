// Latest videos from the CPSTECH YouTube channel via the public RSS feed (no API key).
export const YT_CHANNEL_ID = 'UC8TArdLmRKi_goKSN3oxInA';
export const YT_CHANNEL_URL = `https://www.youtube.com/channel/${YT_CHANNEL_ID}`;

const decode = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export async function getVideos(limit = 15) {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return xml
      .split('<entry>')
      .slice(1)
      .map((e) => ({
        id: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1],
        title: decode((e.match(/<title>([^<]*)<\/title>/) || [])[1]),
        published: (e.match(/<published>([^<]+)<\/published>/) || [])[1],
      }))
      .filter((v) => v.id)
      .slice(0, limit);
  } catch (e) {
    console.error('YouTube feed failed', e);
    return [];
  }
}
