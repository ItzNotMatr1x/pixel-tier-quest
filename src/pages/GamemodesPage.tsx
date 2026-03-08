import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GAMEMODES, getGamemodeLeaderboard, getPlayerBodyUrl, GamemodeId } from "@/lib/data";
import { TierBadge } from "@/components/TierBadge";
import { Crown, Medal } from "lucide-react";

function getModeTitle(points: number): { title: string; color: string; icon: string } {
  if (points >= 60) return { title: "Grandmaster", color: "text-gold", icon: "👑" };
  if (points >= 45) return { title: "Master", color: "text-tier-lt1", icon: "💎" };
  if (points >= 20) return { title: "Expert", color: "text-tier-ht3", icon: "⚡" };
  if (points >= 6) return { title: "Adept", color: "text-tier-lt2", icon: "✦" };
  if (points >= 1) return { title: "Apprentice", color: "text-muted-foreground", icon: "◆" };
  return { title: "Unranked", color: "text-muted-foreground", icon: "○" };
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(43,100%,65%)] to-[hsl(35,100%,45%)] shadow-[0_0_20px_hsl(43,100%,55%/0.5)]" />
      <Crown className="w-5 h-5 md:w-6 md:h-6 text-background relative z-10" />
    </div>
  );
  if (rank === 2) return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(220,15%,78%)] to-[hsl(220,10%,58%)] shadow-[0_0_16px_hsl(220,10%,72%/0.4)]" />
      <Medal className="w-5 h-5 md:w-6 md:h-6 text-background relative z-10" />
    </div>
  );
  if (rank === 3) return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(30,70%,55%)] to-[hsl(25,60%,40%)] shadow-[0_0_16px_hsl(30,60%,50%/0.4)]" />
      <Medal className="w-5 h-5 md:w-6 md:h-6 text-background relative z-10" />
    </div>
  );
  return (
    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <span className="font-display font-black text-xl md:text-2xl text-muted-foreground">{rank}</span>
    </div>
  );
}

export default function GamemodesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMode = (searchParams.get("mode") as GamemodeId) || "sword";
  const gm = GAMEMODES.find(g => g.id === activeMode) || GAMEMODES[0];
  const leaderboard = getGamemodeLeaderboard(activeMode).filter(p => p.tiers[activeMode] !== 'Unranked').slice(0, 100);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-lg">
            {gm.icon}
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Gamemode Rankings</h1>
        </div>
        <p className="text-muted-foreground font-heading text-sm ml-[52px]">View top players per gamemode</p>
      </div>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {GAMEMODES.map(g => (
          <button
            key={g.id}
            onClick={() => setSearchParams({ mode: g.id })}
            className={`px-4 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all flex items-center gap-2
              ${g.id === activeMode
                ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_16px_hsl(var(--primary)/0.15)]'
                : 'glass-card text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
          >
            <span>{g.icon}</span> {g.name}
          </button>
        ))}
      </div>

      {leaderboard.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <span className="text-5xl block mb-4">{gm.icon}</span>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No Players Yet</h3>
          <p className="text-muted-foreground font-heading text-sm">Add players from the <Link to="/admin" className="text-primary hover:underline">Admin Panel</Link>.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[72px_48px_1fr_110px_80px_80px] gap-3 px-5 py-3 border-b border-border/50 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-widest items-center">
            <span>Rank</span>
            <span></span>
            <span>Player</span>
            <span className="text-center">Tier</span>
            <span className="text-center">Points</span>
            <span className="text-center">Region</span>
          </div>

          <div className="divide-y divide-border/20">
            {leaderboard.map((player, i) => {
              const isTop3 = player.rank <= 3;
              const rowBgs = ['bg-gold/[0.04]', 'bg-silver/[0.03]', 'bg-bronze/[0.03]'];
              const borderColors = ['border-l-gold', 'border-l-silver', 'border-l-bronze'];
              const { title, color, icon } = getModeTitle(player.totalPoints);

              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}
                >
                  <Link
                    to={`/player/${player.name}`}
                    className={`grid grid-cols-[52px_40px_1fr_auto] md:grid-cols-[72px_48px_1fr_110px_80px_80px] gap-2 md:gap-3 px-3 md:px-5 py-3 md:py-3.5 items-center transition-all duration-300 group relative
                      hover:bg-secondary/50 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.15)] hover:z-10
                      ${isTop3 ? `${rowBgs[player.rank - 1]} border-l-[3px] ${borderColors[player.rank - 1]}` : 'border-l-[3px] border-l-transparent'}`}
                  >
                    {/* Rank badge */}
                    <div className="flex justify-center">
                      <RankBadge rank={player.rank} />
                    </div>

                    {/* Body render */}
                    <div className="relative flex justify-center h-[56px] md:h-[64px]">
                      <img
                        src={getPlayerBodyUrl(player.name)}
                        alt=""
                        className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:scale-[1.15] group-hover:drop-shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>

                    {/* Player info */}
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-foreground text-sm md:text-[15px] truncate group-hover:text-primary transition-colors duration-300">
                        {player.name}
                      </div>
                      <div className={`text-[11px] md:text-xs font-heading ${color} flex items-center gap-1 mt-0.5`}>
                        <span>{icon}</span> {title}
                      </div>
                    </div>

                    {/* Tier badge - desktop */}
                    <div className="hidden md:flex justify-center">
                      <div className="transition-all duration-300 hover:scale-[1.15]">
                        <TierBadge tier={player.tiers[activeMode]} size="sm" />
                      </div>
                    </div>

                    {/* Points - desktop */}
                    <div className="hidden md:flex justify-center">
                      <span className="font-display font-bold text-primary text-sm">{player.totalPoints}</span>
                    </div>

                    {/* Region - desktop */}
                    <div className="hidden md:flex justify-center">
                      <span className="inline-flex items-center justify-center min-w-[40px] h-7 px-2 rounded-lg bg-secondary/80 text-[11px] font-heading font-bold text-foreground transition-all duration-300 group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)]">
                        {player.region}
                      </span>
                    </div>

                    {/* Mobile: tier badge */}
                    <div className="flex md:hidden items-center gap-2 flex-shrink-0">
                      <TierBadge tier={player.tiers[activeMode]} size="sm" />
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
