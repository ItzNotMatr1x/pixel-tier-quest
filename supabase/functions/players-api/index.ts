import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

const TIER_POINTS: Record<string, number> = {
  Unranked: 0, LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6, HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60,
};

const GAMEMODES = ['sword', 'axe', 'nethpot', 'pot', 'vanilla', 'uhc', 'smp', 'mace'];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "json";
  const mode = url.searchParams.get("mode"); // optional gamemode filter
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);
  const playerName = url.searchParams.get("player"); // optional single player lookup

  const { data: rows, error } = await supabase.from("players").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // Transform rows into players
  const players = (rows || []).map((row: any) => {
    const tiers: Record<string, string> = {};
    for (const gm of GAMEMODES) {
      tiers[gm] = row[`tier_${gm}`] || "Unranked";
    }
    const totalPoints = Object.values(tiers).reduce(
      (sum, t) => sum + (TIER_POINTS[t] || 0),
      0
    );
    return {
      name: row.name,
      region: row.region,
      tiers,
      totalPoints,
      avatar: `https://mc-heads.net/avatar/${row.name}/64`,
      body: `https://mc-heads.net/body/${row.name}/96`,
      head: `https://mc-heads.net/head/${row.name}/64`,
    };
  });

  // Single player lookup
  if (playerName) {
    const player = players.find(
      (p: any) => p.name.toLowerCase() === playerName.toLowerCase()
    );
    if (!player) {
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify(player), { headers: corsHeaders });
  }

  // Sort by mode or overall
  let sorted;
  if (mode && GAMEMODES.includes(mode)) {
    sorted = players
      .filter((p: any) => p.tiers[mode] !== "Unranked")
      .sort(
        (a: any, b: any) =>
          (TIER_POINTS[b.tiers[mode]] || 0) - (TIER_POINTS[a.tiers[mode]] || 0)
      );
  } else {
    sorted = players.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
  }

  const result = sorted.slice(0, limit).map((p: any, i: number) => ({
    rank: i + 1,
    ...p,
  }));

  // Embeddable HTML widget
  if (format === "widget") {
    const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; background: transparent; }
  .row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); transition: all 0.2s; }
  .row:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
  .rank { font-weight: 900; font-size: 18px; width: 32px; text-align: center; color: #64748b; }
  .rank.g { color: #eab308; } .rank.s { color: #94a3b8; } .rank.b { color: #d97706; }
  .head { width: 32px; height: 32px; border-radius: 4px; image-rendering: pixelated; transition: transform 0.3s; transform: perspective(200px) rotateY(-20deg); }
  .row:hover .head { transform: perspective(200px) rotateY(0deg) scale(1.1); }
  .name { font-weight: 700; font-size: 14px; color: #e2e8f0; }
  .pts { font-weight: 700; font-size: 13px; color: #22d3ee; margin-left: auto; }
  .region { font-size: 11px; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 6px; color: #94a3b8; font-weight: 700; }
</style>
</head>
<body>
${result
  .slice(0, 10)
  .map(
    (p: any) => `
  <div class="row">
    <div class="rank ${p.rank === 1 ? "g" : p.rank === 2 ? "s" : p.rank === 3 ? "b" : ""}">${p.rank}</div>
    <img class="head" src="${p.avatar}" alt="${p.name}">
    <div class="name">${p.name}</div>
    <div class="region">${p.region}</div>
    <div class="pts">${p.totalPoints} pts</div>
  </div>`
  )
  .join("")}
</body>
</html>`;
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html" },
    });
  }

  return new Response(JSON.stringify({ players: result, total: players.length }), {
    headers: corsHeaders,
  });
});
