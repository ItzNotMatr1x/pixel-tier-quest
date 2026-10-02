import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Tester = { id: string; discord_username: string; note: string | null };
export type DisplayTester = {
  id: string;
  username: string;
  note: string | null;
  avatar_url: string | null;
  online: boolean;
  source: "manual" | "role";
};

export function useGuildId() {
  const [guildId, setGuildId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("app_settings")
      .select("key, value")
      .in("key", ["discord_guild_id", "discord_tester_role_id"]);
    setGuildId(data?.find(item => item.key === "discord_guild_id")?.value ?? "");
    setRoleId(data?.find(item => item.key === "discord_tester_role_id")?.value ?? "");
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { guildId, roleId, loading, refresh };
}

export function useTesters() {
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("testers")
      .select("id, discord_username, note").order("discord_username");
    setTesters(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { testers, loading, refresh };
}

export function useOnlineTesters(refreshKey = 0) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["discord-testers", refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("discord-testers", { body: {} });
      if (error || data?.error) throw new Error(data?.details || data?.error || error?.message);
      return data as { online: DisplayTester[]; offline: DisplayTester[]; widgetError: string | null };
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });

  return {
    online: data?.online ?? [],
    offline: data?.offline ?? [],
    loading: isLoading,
    widgetError: data?.widgetError ?? (error instanceof Error ? error.message : null),
  };
}