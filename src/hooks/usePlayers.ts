import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryClient } from "@/lib/queryClient";
import {
  Player, GamemodeId, TierName, RankedPlayer,
  getPlayersCloud, addPlayerCloud, updatePlayerCloud, removePlayerCloud,
  rankPlayers, TIER_POINTS
} from "@/lib/data";

export function usePlayers() {
  const { data: players = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayersCloud,
  });

  useEffect(() => {
    const channel = supabase
      .channel(`players-realtime-${crypto.randomUUID()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        queryClient.invalidateQueries({ queryKey: ["players"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPlayers = async () => {
    await refetch();
  };

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
