import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayers } from "@/hooks/usePlayers";
import { getPlayerBodyUrl, GAMEMODES, GamemodeId, TIER_POINTS, TierName } from "@/lib/data";
import { tierBgClasses, tierTextClasses } from "@/components/TierBadge";
import { PlayerHead } from "@/components/PlayerHead";
import { GamemodeIcon } from "@/components/GamemodeIcon";
import { Trophy, Search, Crown, Medal, Swords } from "lucide-react";

function getRankTitle(points: number): { title: string; color: string; icon: string } {
  if (points >= 400) return { title: "Combat Grandmaster", color: "text-gold", icon: "👑" };
  if (points >= 250) return { title: "Combat Master", color: "text-tier-ht2", icon: "💎" };
  if (points >= 150) return { title: "Combat Ace", color: "text-tier-lt5", icon: "🔥" };
  if (points >= 80) return { title: "Combat Expert", color: "text-tier-ht3", icon: "⚡" };
  if (points >= 40) return { title: "Combat Adept", color: "text-tier-lt1", icon: "✦" };
  if (points >= 15) return { title: "Combat Apprentice", color: "text-tier-lt2", icon: "◆" };
  return { title: "Combat Novice", color: "text-muted-foreground", icon: "○" };
}

function RankBadge({ rank }: { rank: number }) {
  const shineOverlay = (
    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite] z-10" />
  );
  if (rank === 1) return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(43,100%,65%)] to-[hsl(35,100%,45%)] shadow-[0_0_20px_hsl(43,100%,55%/0.5)] overflow-hidden">
        {shineOverlay}
      </div>
      <Crown className="w-5 h-5 md:w-6 md:h-6 text-background relative z-20" />
    </div>
  );
  if (rank === 2) return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(220,15%,78%)] to-[hsl(220,10%,58%)] shadow-[0_0_16px_hsl(220,10%,72%/0.4)] overflow-hidden">
        {shineOverlay}
      </div>
      <Medal className="w-5 h-5 md:w-6 md:h-6 text-background relative z-20" />
    </div>
  );
  if (rank === 3) return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(30,70%,55%)] to-[hsl(25,60%,40%)] shadow-[0_0_16px_hsl(30,60%,50%/0.4)] overflow-hidden">
        {shineOverlay}
      </div>
      <Medal className="w-5 h-5 md:w-6 md:h-6 text-background relative z-20" />
    </div>
  );
  return (
    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <span className="font-display font-black text-xl md:text-2xl text-muted-foreground">{rank}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const { ranked, loading } = usePlayers();
  const filtered = search
    ? ranked.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : ranked.slice(0, 100);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Overall Leaderboard</h1>
          </div>
          <p className="text-muted-foreground font-heading text-sm ml-[52px]">Top players ranked by total points across all gamemodes</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search player…"
            className="glass-card pl-9 pr-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full bg-transparent focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Trophy className="w-14 h-14 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No Players Found</h3>
          <p className="text-muted-foreground font-heading text-sm">
            {search ? "Try a different search term." : <>Add players from the <Link to="/admin" className="text-primary hover:underline">Admin Panel</Link>.</>}
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[72px_48px_minmax(0,1fr)_88px_256px] gap-3 px-5 py-3 border-b border-border/50 border-l-[3px] border-l-transparent text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-widest items-center">
            <div className="flex justify-center">Rank</div>
            <span></span>
            <span>Player</span>
            <div className="flex justify-center">Region</div>
            <div className="flex justify-center">Tiers</div>
          </div>

          <div className="divide-y divide-border/20">
            {filtered.map((player, i) => {
              const { title, color, icon } = getRankTitle(player.totalPoints);
              const isTop3 = player.rank <= 3;
              const rowBgs = ['bg-gold/[0.06]', 'bg-silver/[0.04]', 'bg-bronze/[0.04]'];
              const borderColors = ['border-l-gold', 'border-l-silver', 'border-l-bronze'];
              const rowGlows = [
                'shadow-[0_0_15px_hsl(43,100%,55%/0.15),0_0_30px_hsl(43,100%,55%/0.08)]',
                'shadow-[0_0_15px_hsl(220,10%,72%/0.15),0_0_30px_hsl(220,10%,72%/0.08)]',
                'shadow-[0_0_15px_hsl(30,60%,50%/0.15),0_0_30px_hsl(30,60%,50%/0.08)]',
              ];

              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}
                  onMouseEnter={() => setHoveredPlayer(player.name)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                >
                  <Link
                    to={`/player/${player.name}`}
                    className={`grid grid-cols-[52px_40px_1fr_auto] md:grid-cols-[72px_48px_1fr_80px_auto] gap-2 md:gap-3 px-3 md:px-5 py-3 md:py-3.5 items-center transition-all duration-300 group relative
                      hover:bg-secondary/50 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.15)] hover:z-10
                      ${isTop3 ? `${rowBgs[player.rank - 1]} border-l-[3px] ${borderColors[player.rank - 1]} ${rowGlows[player.rank - 1]}` : 'border-l-[3px] border-l-transparent'}`}
                  >
                    {/* Rank badge */}
                    <div className="flex justify-center">
                      <RankBadge rank={player.rank} />
                    </div>

                    {/* Head render */}
                    <div className="flex justify-center">
                      <PlayerHead name={player.name} size={40} />
                    </div>

                    {/* Player info */}
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-foreground text-sm md:text-[15px] truncate group-hover:text-primary transition-colors duration-300">
                        {player.name}
                      </div>
                      <div className={`text-[11px] md:text-xs font-heading ${color} flex items-center gap-1 mt-0.5`}>
                        <span>{icon}</span> {title}
                        <span className="text-muted-foreground ml-1">• {player.totalPoints} pts</span>
                      </div>
                    </div>

                    {/* Region badge */}
                    <div className="hidden md:flex justify-center">
                      <span className="inline-flex items-center justify-center min-w-[40px] h-7 px-2 rounded-lg bg-secondary/80 text-[11px] font-heading font-bold text-foreground transition-all duration-300 group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)]">
                        {player.region}
                      </span>
                    </div>

                    {/* Tier dots */}
                    <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                      {GAMEMODES.map(gm => {
                        const tier = player.tiers[gm.id as GamemodeId];
                        if (tier === 'Unranked') {
                          return (
                            <div key={gm.id} className="relative group/tier flex flex-col items-center">
                              <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-muted/30 flex items-center justify-center border border-border/30" title={`${gm.name}: Unranked`}>
                                <span className="text-[7px] md:text-[9px] text-muted-foreground/50">—</span>
                              </div>
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-background/95 border border-border/50 text-[8px] font-heading font-bold text-muted-foreground whitespace-nowrap opacity-0 group-hover/tier:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-lg">
                                {gm.name}: Unranked
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={gm.id} className="relative group/tier flex flex-col items-center transition-all duration-300 hover:scale-[1.2]">
                            <div className={`w-5 h-5 md:w-7 md:h-7 rounded-full bg-secondary/60 border border-border/40 flex items-center justify-center shadow-sm transition-shadow duration-300 hover:shadow-[0_0_12px_currentColor]`}>
                              <GamemodeIcon icon={gm.icon} className="w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-background/95 border border-border/50 text-[8px] font-heading font-bold whitespace-nowrap opacity-0 group-hover/tier:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-lg">
                              <span className={tierTextClasses[tier]}>{gm.name}: {tier}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Link>

                  {/* Expanded stats panel on hover */}
                  <AnimatePresence>
                    {hoveredPlayer === player.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 py-3 bg-secondary/30 border-t border-border/20">
                          <div className="flex items-center gap-2 mb-2.5">
                            <Swords className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-widest">Tier Breakdown</span>
                          </div>
                          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {GAMEMODES.map(gm => {
                              const tier = player.tiers[gm.id as GamemodeId];
                              const pts = TIER_POINTS[tier as TierName];
                              const isRanked = tier !== 'Unranked';
                              return (
                                <div
                                  key={gm.id}
                                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isRanked ? 'bg-secondary/60' : 'bg-muted/20'}`}
                                >
                                  <GamemodeIcon icon={gm.icon} className="w-4 h-4" />
                                  <span className="text-[10px] font-heading font-bold text-muted-foreground">{gm.name}</span>
                                  <span className={`text-[11px] font-heading font-bold ${isRanked ? tierTextClasses[tier as TierName] : 'text-muted-foreground/40'}`}>
                                    {tier}
                                  </span>
                                  <span className="text-[9px] font-heading text-muted-foreground">
                                    {pts} pts
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
