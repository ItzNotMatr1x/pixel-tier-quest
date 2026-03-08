import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRankedPlayers, getPlayerAvatarUrl } from "@/lib/data";
import { Trophy } from "lucide-react";

const allPlayers = getRankedPlayers();

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
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
          placeholder="Filter by name…"
          className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full max-w-sm bg-transparent"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_100px_80px] md:grid-cols-[80px_48px_1fr_120px_80px] gap-2 px-4 py-3 border-b border-border/50 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
          <span>Rank</span>
          <span className="hidden md:block">Avatar</span>
          <span>Player</span>
          <span className="text-right">Points</span>
          <span className="text-right">Region</span>
        </div>
        <div className="divide-y divide-border/30">
          {filtered.map((player, i) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
            >
              <Link
                to={`/player/${player.name}`}
                className={`grid grid-cols-[60px_1fr_100px_80px] md:grid-cols-[80px_48px_1fr_120px_80px] gap-2 px-4 py-3 items-center hover:bg-secondary/30 transition-colors
                  ${player.rank === 1 ? 'bg-gold/5 border-l-2 border-l-gold' : ''}
                  ${player.rank === 2 ? 'bg-silver/5 border-l-2 border-l-silver' : ''}
                  ${player.rank === 3 ? 'bg-bronze/5 border-l-2 border-l-bronze' : ''}`}
              >
                <span className={`font-display font-black text-sm
                  ${player.rank === 1 ? 'text-gold' : player.rank === 2 ? 'text-silver' : player.rank === 3 ? 'text-bronze' : 'text-muted-foreground'}`}>
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                </span>
                <img src={getPlayerAvatarUrl(player.name)} alt="" className="w-8 h-8 rounded-sm hidden md:block" />
                <span className="font-heading font-bold text-foreground text-sm truncate">{player.name}</span>
                <span className="font-display font-bold text-primary text-sm text-right">{player.totalPoints}</span>
                <span className="text-xs text-muted-foreground text-right">{player.region}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
