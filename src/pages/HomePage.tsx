import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePlayers } from "@/hooks/usePlayers";
import { GAMEMODES, TIER_POINTS, type GamemodeId, type TierName } from "@/lib/data";
import { PlayerHead } from "@/components/PlayerHead";
import { GamemodeIcon } from "@/components/GamemodeIcon";
import { TierBadge } from "@/components/TierBadge";
import { Swords, Trophy, Users, Globe, ChevronRight, Copy, Check, Zap, MessageSquare } from "lucide-react";

const OnlineTesters = lazy(() => import("@/components/OnlineTesters").then(module => ({ default: module.OnlineTesters })));

const SERVER_IP = "sailorpvp.lol";
const DISCORD_URL = "https://discord.gg/APudySH8Q8";
const HIGH_TIERS: TierName[] = ["HT3", "HT2", "HT1"];

export default function HomePage() {
  const { ranked, loading } = usePlayers();
  const [copied, setCopied] = useState(false);
  const top5 = ranked.slice(0, 5);
  const ticker = ranked.slice(0, 14);
  const playerCount = ranked.length;

  const highTierResults = useMemo(() => {
    const results: { player: typeof ranked[number]; gm: GamemodeId; tier: TierName }[] = [];
    for (const player of ranked) {
      for (const gm of GAMEMODES) {
        const tier = player.tiers[gm.id];
        if (HIGH_TIERS.includes(tier)) results.push({ player, gm: gm.id, tier });
      }
    }
    return results.sort((a, b) => TIER_POINTS[b.tier] - TIER_POINTS[a.tier]).slice(0, 8);
  }, [ranked]);

  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="orb w-[520px] h-[520px] bg-primary/15 absolute -top-40 left-1/4" />
        <div className="orb w-[420px] h-[420px] bg-accent/10 absolute top-20 -right-24" style={{ animationDelay: "-7s" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="container mx-auto px-4 relative z-10 text-center pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 mb-6 text-xs font-heading font-bold tracking-widest text-primary uppercase">
              <Zap className="w-3.5 h-3.5" /> Competitive Minecraft PvP Tier List
            </div>

            <div className="flex items-center justify-center mb-6">
              <img
                src="/favicon.png"
                alt="SailorTiers logo"
                fetchPriority="high"
                decoding="async"
                width={112}
                height={112}
                className="w-24 h-24 md:w-28 md:h-28 object-contain animate-float drop-shadow-[0_0_24px_hsl(var(--primary)/0.6)]"
              />
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl tracking-tight mb-4">
              <span className="text-gradient">SAILOR TIERS</span>
            </h1>
            <p className="font-heading text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The ultimate competitive PvP experience — global rankings, official testers, and a state-of-the-art server.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/leaderboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg glow-cyan hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" /> View Leaderboard
              </Link>
              <Link to="/players" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold text-lg hover:bg-secondary/80 transition-colors">
                <Users className="w-5 h-5" /> Browse Players
              </Link>
            </div>

            <button
              onClick={copyIp}
              className="group mt-8 inline-flex items-center gap-3 glass-card px-5 py-3 font-heading font-bold tracking-widest text-sm text-foreground hover:border-primary/40 hover:glow-cyan transition-all"
              title="Copy server IP"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>{SERVER_IP}</span>
              <span className="w-px h-4 bg-border" />
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
              <span className="text-[10px] uppercase text-muted-foreground">{copied ? "Copied" : "Copy IP"}</span>
            </button>
          </motion.div>
        </div>

        {/* Live ticker */}
        {ticker.length > 0 && (
          <div className="relative z-10 border-y border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden marquee-mask">
            <div className="flex w-max animate-marquee py-2.5">
              {[0, 1].map(copy => (
                <div key={copy} className="flex items-center">
                  {ticker.map(p => (
                    <Link key={`${copy}-${p.name}`} to={`/player/${p.name}`} className="flex items-center gap-2 px-5 text-sm font-heading whitespace-nowrap hover:text-primary transition-colors">
                      <Swords className="w-3.5 h-3.5 text-primary/70" />
                      <span className="font-bold text-foreground">{p.name}</span>
                      <span className="text-muted-foreground">#{p.rank}</span>
                      <span className="text-primary font-bold">{p.totalPoints}pts</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 mt-14 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Players", value: String(playerCount), icon: Users },
            { label: "Gamemodes", value: String(GAMEMODES.length), icon: Swords },
            { label: "Tiers", value: "10", icon: Trophy },
            { label: "Regions", value: "5", icon: () => <span className="text-lg">🌍</span> },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-5 text-center relative overflow-hidden group hover:border-primary/30 transition-colors">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]" />
              <stat.icon className="w-5 h-5 mx-auto text-primary mb-2" />
              <div className="font-display font-bold text-2xl text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-heading">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* High Tier Results */}
      {highTierResults.length > 0 && (
        <section className="container mx-auto px-4 mb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">High Tier Results</h2>
              <p className="text-muted-foreground font-heading text-sm">Latest HT3 and above achievements</p>
            </div>
            <Link to="/leaderboard" className="text-primary text-sm font-heading flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {highTierResults.map((r, i) => (
              <motion.div key={`${r.player.name}-${r.gm}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
                <Link to={`/player/${r.player.name}`} className="glass-card p-4 flex items-center gap-3 hover:glow-cyan hover:border-primary/30 transition-all group">
                  <PlayerHead name={r.player.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-bold text-foreground group-hover:text-primary transition-colors truncate text-sm">{r.player.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GamemodeIcon icon={GAMEMODES.find(g => g.id === r.gm)?.icon ?? ""} className="w-3.5 h-3.5" />
                      {GAMEMODES.find(g => g.id === r.gm)?.name}
                    </div>
                  </div>
                  <TierBadge tier={r.tier} size="sm" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Top Players Preview */}
      {top5.length > 0 && (
        <section className="container mx-auto px-4 mb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">Top Players</h2>
              <p className="text-muted-foreground font-heading text-sm">Highest overall points</p>
            </div>
            <Link to="/leaderboard" className="text-primary text-sm font-heading flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {top5.map((player, i) => (
              <motion.div key={player.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
                <Link
                  to={`/player/${player.name}`}
                  className={`glass-card flex items-center gap-4 p-4 hover:bg-secondary/30 transition-all group
                    ${i === 0 ? 'border-gold/30 glow-cyan' : ''}
                    ${i === 1 ? 'border-silver/30' : ''}
                    ${i === 2 ? 'border-bronze/30' : ''}`}
                >
                  <div className={`font-display font-black text-lg w-8 text-center
                    ${i === 0 ? 'text-gold' : i === 1 ? 'text-silver' : i === 2 ? 'text-bronze' : 'text-muted-foreground'}`}>
                    #{player.rank}
                  </div>
                  <PlayerHead name={player.name} size={36} />
                  <div className="flex-1">
                    <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{player.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{player.region}</span>
                  </div>
                  <span className="font-display font-bold text-primary text-lg">{player.totalPoints}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Online Testers */}
      <Suspense fallback={<section className="container mx-auto px-4 mb-20 h-48" aria-hidden="true" />}>
        <OnlineTesters />
      </Suspense>

      {/* Gamemodes */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">Gamemodes</h2>
            <p className="text-muted-foreground font-heading text-sm">Officially ranked kits</p>
          </div>
          <Link to="/gamemodes" className="text-primary text-sm font-heading flex items-center gap-1 hover:underline">
            All Rankings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GAMEMODES.map((gm, i) => {
            const rankedCount = ranked.filter(p => p.tiers[gm.id] !== 'Unranked').length;
            return (
              <motion.div key={gm.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
                <Link to={`/gamemodes?mode=${gm.id}`} className="glass-card p-6 text-center hover:glow-cyan hover:border-primary/30 transition-all block group relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]" />
                  <GamemodeIcon icon={gm.icon} className="w-8 h-8 text-3xl mx-auto mb-2" />
                  <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors block">{gm.name}</span>
                  <span className="text-xs text-muted-foreground font-heading">{rankedCount} ranked</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Discord CTA */}
      <section className="container mx-auto px-4 mb-24">
        <div className="gradient-border">
          <div className="relative overflow-hidden rounded-xl p-10 text-center">
            <div className="orb w-[380px] h-[380px] bg-primary/10 absolute -top-32 left-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <MessageSquare className="w-8 h-8 mx-auto text-primary mb-3" />
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">Join our official Discord Server!</h2>
              <p className="text-muted-foreground font-heading mb-6 max-w-md mx-auto">Get tested, follow announcements, and hang out with the community.</p>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold glow-cyan hover:scale-105 transition-transform"
              >
                Join our Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
