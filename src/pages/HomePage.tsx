import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRankedPlayers, GAMEMODES, getPlayerAvatarUrl, getPlayerBodyUrl } from "@/lib/data";
import { Swords, Trophy, Users, ChevronRight } from "lucide-react";

export default function HomePage() {
  const allRanked = getRankedPlayers();
  const top5 = allRanked.slice(0, 5);
  const playerCount = allRanked.length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Swords className="w-12 h-12 text-primary drop-shadow-[0_0_12px_hsl(190_100%_50%/0.6)]" />
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl tracking-tight text-foreground text-glow-cyan mb-4">
              PIXEL TIERS
            </h1>
            <p className="font-heading text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The definitive Minecraft PvP ranking platform. Track tiers, compete globally, and prove your skills.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/leaderboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg glow-cyan hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" /> View Leaderboard
              </Link>
              <Link to="/players" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold text-lg hover:bg-secondary/80 transition-colors">
                <Users className="w-5 h-5" /> Browse Players
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Players", value: String(playerCount), icon: Users },
            { label: "Gamemodes", value: "8", icon: Swords },
            { label: "Tiers", value: "10", icon: Trophy },
            { label: "Regions", value: "5", icon: () => <span className="text-lg">🌍</span> },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-5 text-center">
              <stat.icon className="w-5 h-5 mx-auto text-primary mb-2" />
              <div className="font-display font-bold text-2xl text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-heading">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Players Preview */}
      {top5.length > 0 && (
        <section className="container mx-auto px-4 mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-foreground">Top Players</h2>
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
                  <img src={getPlayerBodyUrl(player.name)} alt={player.name} className="w-8 h-16 object-contain" />
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

      {/* Gamemodes */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">Gamemodes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GAMEMODES.map((gm, i) => (
            <motion.div key={gm.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
              <Link to={`/gamemodes?mode=${gm.id}`} className="glass-card p-6 text-center hover:glow-cyan hover:border-primary/30 transition-all block group">
                <span className="text-3xl block mb-2">{gm.icon}</span>
                <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{gm.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
