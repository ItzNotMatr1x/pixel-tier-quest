import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRankedPlayers, getPlayerAvatarUrl, GAMEMODES, TIER_POINTS, GamemodeId, TierName } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";
import { tierBgClasses } from "@/components/TierBadge";
import { Trophy } from "lucide-react";

function getRankTitle(points: number): { title: string; color: string } {
  if (points >= 400) return { title: "Combat Grandmaster", color: "text-gold" };
  if (points >= 250) return { title: "Combat Master", color: "text-tier-ht2" };
  if (points >= 150) return { title: "Combat Ace", color: "text-tier-lt5" };
  if (points >= 80) return { title: "Combat Expert", color: "text-tier-ht3" };
  if (points >= 40) return { title: "Combat Adept", color: "text-tier-lt1" };
  if (points >= 15) return { title: "Combat Apprentice", color: "text-tier-lt2" };
  return { title: "Combat Novice", color: "text-muted-foreground" };
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const allPlayers = getRankedPlayers();
  const filtered = search
    ? allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : allPlayers.slice(0, 100);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="w-7 h-7 text-primary" />
        <h1 className="font-display font-bold text-3xl text-foreground">Overall Leaderboard</h1>
      </div>
      <p className="text-muted-foreground font-heading mb-6">Top players ranked by total points across all gamemodes</p>

      <div className="mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search player…"
          className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full max-w-sm bg-transparent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No Players Yet</h3>
          <p className="text-muted-foreground font-heading text-sm">Add players from the <Link to="/admin" className="text-primary hover:underline">Admin Panel</Link> to see them here.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[50px_1fr_auto_auto] md:grid-cols-[50px_56px_1fr_80px_auto] gap-3 px-4 py-3 border-b border-border/50 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider items-center">
            <span>#</span>
            <span className="hidden md:block">Player</span>
            <span className="md:hidden">Player</span>
            <span className="hidden md:block">Region</span>
            <span className="text-right">Tiers</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/30">
            {filtered.map((player, i) => {
              const { title, color } = getRankTitle(player.totalPoints);
              const isTop3 = player.rank <= 3;
              const rankColors = ['text-gold', 'text-silver', 'text-bronze'];
              const rowBgs = ['bg-gold/[0.06]', 'bg-silver/[0.04]', 'bg-bronze/[0.04]'];
              const borderColors = ['border-l-gold', 'border-l-silver', 'border-l-bronze'];

              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.015, 0.4) }}
                >
                  <Link
                    to={`/player/${player.name}`}
                    className={`grid grid-cols-[50px_1fr_auto] md:grid-cols-[50px_56px_1fr_80px_auto] gap-3 px-4 py-3 items-center hover:bg-secondary/30 transition-colors
                      ${isTop3 ? `${rowBgs[player.rank - 1]} border-l-[3px] ${borderColors[player.rank - 1]}` : ''}`}
                  >
                    {/* Rank */}
                    <span className={`font-display font-black text-lg ${isTop3 ? rankColors[player.rank - 1] : 'text-muted-foreground'}`}>
                      {player.rank}.
                    </span>

                    {/* Avatar - desktop */}
                    <img
                      src={getPlayerBodyUrl(player.name)}
                      alt=""
                      className="w-10 h-[56px] object-contain hidden md:block"
                    />

                    {/* Player info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getPlayerBodyUrl(player.name)}
                        alt=""
                        className="w-8 h-[44px] object-contain md:hidden flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-foreground text-sm truncate">{player.name}</div>
                        <div className={`text-xs font-heading ${color} flex items-center gap-1`}>
                          <span>⬥</span> {title} <span className="text-muted-foreground">({player.totalPoints} points)</span>
                        </div>
                      </div>
                    </div>

                    {/* Region badge - desktop */}
                    <div className="hidden md:flex justify-center">
                      <span className="inline-flex items-center justify-center w-10 h-7 rounded-md bg-secondary text-xs font-heading font-bold text-foreground">
                        {player.region}
                      </span>
                    </div>

                    {/* Gamemode tier dots */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {GAMEMODES.map(gm => {
                        const tier = player.tiers[gm.id as GamemodeId];
                        if (tier === 'Unranked') {
                          return (
                            <div key={gm.id} className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center" title={`${gm.name}: Unranked`}>
                              <span className="text-[8px] text-muted-foreground">-</span>
                            </div>
                          );
                        }
                        return (
                          <div key={gm.id} className="flex flex-col items-center gap-0.5" title={`${gm.name}: ${tier}`}>
                            <div className={`w-6 h-6 rounded-full ${tierBgClasses[tier]} flex items-center justify-center`}>
                              <span className="text-[9px] font-bold text-background drop-shadow-sm">{gm.icon}</span>
                            </div>
                            <span className="text-[7px] font-heading font-bold text-muted-foreground leading-none hidden lg:block">{tier}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
