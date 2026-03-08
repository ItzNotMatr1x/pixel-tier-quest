import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePlayers } from "@/hooks/usePlayers";
import { GAMEMODES, TIER_POINTS, GamemodeId, getPlayerByName } from "@/lib/data";
import { PlayerHead } from "@/components/PlayerHead";
import { TierBadge } from "@/components/TierBadge";
import { GamemodeIcon } from "@/components/GamemodeIcon";
import { ArrowLeft, Trophy, MapPin } from "lucide-react";

export default function PlayerProfilePage() {
  const { name } = useParams<{ name: string }>();
  const { players, loading } = usePlayers();
  const player = getPlayerByName(name || "", players);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-foreground mb-4">Player Not Found</h1>
        <Link to="/players" className="text-primary font-heading hover:underline">← Back to Players</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link to="/leaderboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 font-heading">
        <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 mb-6 glow-cyan"
      >
        <div className="flex items-center gap-6 group">
          <PlayerHead name={player.name} size={80} selfHover />
          <div>
            <h1 className="font-display font-black text-3xl md:text-4xl text-foreground text-glow-cyan">{player.name}</h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-muted-foreground font-heading">
                <MapPin className="w-4 h-4" /> {player.region}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground font-heading">
                <Trophy className="w-4 h-4" /> Rank #{player.rank}
              </span>
              <span className="font-display font-bold text-primary text-lg">{player.totalPoints} pts</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gamemode Tiers */}
      <h2 className="font-display font-bold text-xl text-foreground mb-4">Gamemode Tiers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GAMEMODES.map((gm, i) => {
          const tier = player.tiers[gm.id as GamemodeId];
          const pts = TIER_POINTS[tier];
          return (
            <motion.div
              key={gm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-card p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{gm.icon}</span>
                <span className="font-heading font-bold text-foreground">{gm.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <TierBadge tier={tier} size="md" />
                <span className="font-display text-sm text-muted-foreground w-12 text-right">{pts}pts</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
