import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GAMEMODES, getGamemodeLeaderboard, getPlayerAvatarUrl, getPlayerBodyUrl, GamemodeId } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";

export default function GamemodesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMode = (searchParams.get("mode") as GamemodeId) || "sword";
  const gm = GAMEMODES.find(g => g.id === activeMode) || GAMEMODES[0];
  const leaderboard = getGamemodeLeaderboard(activeMode).slice(0, 100);

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
          <div className="grid grid-cols-[60px_48px_1fr_100px_80px_80px] gap-2 px-4 py-3 border-b border-border/50 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
            <span>Rank</span>
            <span>Avatar</span>
            <span>Player</span>
            <span>Tier</span>
            <span className="text-right">Points</span>
            <span className="text-right">Region</span>
          </div>
          <div className="divide-y divide-border/30">
            {leaderboard.map((player, i) => (
              <motion.div key={player.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.015, 0.4) }}>
                <Link
                  to={`/player/${player.name}`}
                  className={`grid grid-cols-[60px_48px_1fr_100px_80px_80px] gap-2 px-4 py-2 items-center hover:bg-secondary/30 transition-colors
                    ${player.rank === 1 ? 'bg-gold/5 border-l-2 border-l-gold' : ''}
                    ${player.rank === 2 ? 'bg-silver/5 border-l-2 border-l-silver' : ''}
                    ${player.rank === 3 ? 'bg-bronze/5 border-l-2 border-l-bronze' : ''}`}
                >
                  <span className={`font-display font-black text-sm
                    ${player.rank === 1 ? 'text-gold' : player.rank === 2 ? 'text-silver' : player.rank === 3 ? 'text-bronze' : 'text-muted-foreground'}`}>
                    {player.rank <= 3 ? ['🥇','🥈','🥉'][player.rank-1] : `#${player.rank}`}
                  </span>
                  <img src={getPlayerBodyUrl(player.name)} alt="" className="w-10 h-[52px] object-contain" />
                  <span className="font-heading font-bold text-foreground text-sm truncate">{player.name}</span>
                  <TierBadge tier={player.tiers[activeMode]} size="sm" />
                  <span className="font-display font-bold text-primary text-sm text-right">{player.totalPoints}</span>
                  <span className="text-xs text-muted-foreground text-right">{player.region}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
