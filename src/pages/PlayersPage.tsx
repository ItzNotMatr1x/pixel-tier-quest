import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRankedPlayers, getPlayerAvatarUrl, getPlayerBodyUrl } from "@/lib/data";
import { Users } from "lucide-react";

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const allPlayers = getRankedPlayers();
  const filtered = search
    ? allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : allPlayers;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Users className="w-7 h-7 text-primary" />
        <h1 className="font-display font-bold text-3xl text-foreground">Players</h1>
      </div>
      <p className="text-muted-foreground font-heading mb-6">Browse all ranked players</p>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search players…"
        className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full max-w-sm bg-transparent mb-6"
      />

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No Players Yet</h3>
          <p className="text-muted-foreground font-heading text-sm">Add players from the <Link to="/admin" className="text-primary hover:underline">Admin Panel</Link>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.slice(0, 100).map((player, i) => (
            <motion.div key={player.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}>
              <Link to={`/player/${player.name}`} className="glass-card p-4 flex items-center gap-3 hover:glow-cyan hover:border-primary/30 transition-all group">
                <img src={getPlayerAvatarUrl(player.name)} alt={player.name} className="w-10 h-10 rounded-lg" />
                <div>
                  <div className="font-heading font-bold text-foreground group-hover:text-primary transition-colors text-sm">{player.name}</div>
                  <div className="text-xs text-muted-foreground">{player.region} · #{player.rank} · {player.totalPoints}pts</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
