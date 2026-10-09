export default async function handler(req, res) { if (req.method !== "GET") { return res.status(405).json({ error: "Method not allowed" }); }
const nickname = String(req.query.nickname || "").trim();
if (!nickname) { return res.status(400).json({ error: "Укажи ник FACEIT в параметре nickname" }); }
const apiKey = process.env.FACEIT_API_KEY;
if (!apiKey) { return res.status(500).json({ error: "API key is not configured" }); }
try { const url = new URL( "https://open.faceit.com/data/v4/players" ); url.searchParams.set("nickname", nickname); url.searchParams.set("game", "cs2");
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json"
  }
});

const data = await response.json();

if (!response.ok) {
  return res.status(response.status).json({
    error: data.message || "FACEIT API request failed"
  });
}

return res.status(200).json({
  nickname: data.nickname,
  player_id: data.player_id,
  faceit_url: data.faceit_url,
  avatar: data.avatar,
  country: data.country,
  games: data.games,
  membership_type: data.membership_type
});
} catch { return res.status(502).json({ error: "Не удалось связаться с FACEIT API" }); } }
