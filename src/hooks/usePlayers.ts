import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Player, GamemodeId, TierName, RankedPlayer,
  getPlayersCloud, addPlayerCloud, updatePlayerCloud, removePlayerCloud,
  rankPlayers, TIER_POINTS
} from "@/lib/data";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    const data = await getPlayersCloud();
    setPlayers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlayers();

    // Realtime subscription
    const channel = supabase
      .channel(`players-realtime-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        fetchPlayers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPlayers]);

  const addPlayer = async (player: Player) => {
    const ok = await addPlayerCloud(player);
    if (ok) await fetchPlayers();
    return ok;
  };

  const updatePlayer = async (originalName: string, player: Player) => {
    const ok = await updatePlayerCloud(originalName, player);
    if (ok) await fetchPlayers();
    return ok;
  };

  const removePlayer = async (name: string) => {
    const ok = await removePlayerCloud(name);
    if (ok) await fetchPlayers();
    return ok;
  };

  const ranked = rankPlayers(players);

  const getGamemodeLeaderboard = (gm: GamemodeId): RankedPlayer[] => {
    return players
      .map(p => ({ ...p, totalPoints: TIER_POINTS[p.tiers[gm]], rank: 0 }))
      .sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name))
      .map((p, i) => ({ ...p, rank: i + 1 }));
  };

  return {
    players,
    ranked,
    loading,
    addPlayer,
    updatePlayer,
    removePlayer,
    getGamemodeLeaderboard,
    refetch: fetchPlayers,
  };
}
