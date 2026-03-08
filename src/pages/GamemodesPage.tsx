import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GAMEMODES, getGamemodeLeaderboard, getPlayerBodyUrl, GamemodeId } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";

function getModeTitle(points: number): { title: string; color: string } {
  if (points >= 60) return { title: "Grandmaster", color: "text-gold" };
  if (points >= 45) return { title: "Master", color: "text-tier-lt1" };
  if (points >= 20) return { title: "Expert", color: "text-tier-ht3" };
  if (points >= 6) return { title: "Adept", color: "text-tier-lt2" };
  if (points >= 1) return { title: "Apprentice", color: "text-muted-foreground" };
  return { title: "Unranked", color: "text-muted-foreground" };
}

export default function GamemodesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMode = (searchParams.get("mode") as GamemodeId) || "sword";
  const gm = GAMEMODES.find(g => g.id === activeMode) || GAMEMODES[0];
  const leaderboard = getGamemodeLeaderboard(activeMode).filter(p => p.tiers[activeMode] !== 'Unranked').slice(0, 100);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl text-foreground mb-2">Gamemode Rankings</h1>
      <p className="text-muted-foreground font-heading mb-6">View top players per gamemode</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {GAMEMODES.map(g => (
          <button
            key={g.id}
            onClick={() => setSearchParams({ mode: g.id })}
            className={`px-4 py-2 rounded-lg text-sm font-heading font-medium transition-all flex items-center gap-2
              ${g.id === activeMode ? 'bg-primary/15 text-primary border border-primary/30 glow-cyan' : 'glass-card text-muted-foreground hover:text-foreground'}`}
          >
            <span>{g.icon}</span> {g.name}
          </button>
        ))}
      </div>

      {leaderboard.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl block mb-4">{gm.icon}</span>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No Players Yet</h3>
          <p className="text-muted-foreground font-heading text-sm">Add players from the <Link to="/admin" className="text-primary hover:underline">Admin Panel</Link>.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-[50px_1fr_100px_80px_80px] gap-3 px-4 py-3 border-b border-border/50 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider items-center">
            <span>#</span>
            <span>Player</span>
            <span>Tier</span>
            <span className="text-right">Points</span>
            <span className="text-right">Region</span>
          </div>
          <div className="divide-y divide-border/30">
            {leaderboard.map((player, i) => {
              const isTop3 = player.rank <= 3;
              const rankColors = ['text-gold', 'text-silver', 'text-bronze'];
              const rowBgs = ['bg-gold/[0.06]', 'bg-silver/[0.04]', 'bg-bronze/[0.04]'];
              const borderColors = ['border-l-gold', 'border-l-silver', 'border-l-bronze'];
              const { title, color } = getModeTitle(player.totalPoints);

              return (
                <motion.div key={player.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.015, 0.4) }}>
                  <Link
                    to={`/player/${player.name}`}
                    className={`grid grid-cols-[50px_1fr_100px_80px_80px] gap-3 px-4 py-3 items-center hover:bg-secondary/30 transition-colors group
                      ${isTop3 ? `${rowBgs[player.rank - 1]} border-l-[3px] ${borderColors[player.rank - 1]}` : ''}`}
                  >
                    <span className={`font-display font-black text-lg ${isTop3 ? rankColors[player.rank - 1] : 'text-muted-foreground'}`}>
                      {player.rank}.
                    </span>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getPlayerAvatarUrl(player.name)}
                        alt=""
                        className="w-8 h-8 rounded-sm flex-shrink-0 transition-transform duration-300 group-hover:[transform:perspective(200px)_rotateY(-15deg)_scale(1.1)] -ml-1"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-foreground text-sm truncate">{player.name}</div>
                        <div className={`text-xs font-heading ${color}`}>⬥ {title}</div>
                      </div>
                    </div>
                    <TierBadge tier={player.tiers[activeMode]} size="sm" />
                    <span className="font-display font-bold text-primary text-sm text-right">{player.totalPoints}</span>
                    <div className="flex justify-end">
                      <span className="inline-flex items-center justify-center w-10 h-7 rounded-md bg-secondary text-xs font-heading font-bold text-foreground">
                        {player.region}
                      </span>
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
