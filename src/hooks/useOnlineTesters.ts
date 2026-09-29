import { useEffect, useState, useCallback } from "react";
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
  const [online, setOnline] = useState<DisplayTester[]>([]);
  const [offline, setOffline] = useState<DisplayTester[]>([]);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchTesters = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("discord-testers", { body: {} });
        if (error || data?.error) throw new Error(data?.details || data?.error || error?.message);
        if (!cancelled) {
          setOnline(data.online ?? []);
          setOffline(data.offline ?? []);
          setWidgetError(data.widgetError ?? null);
        }
      } catch (error) {
        if (!cancelled) setWidgetError(error instanceof Error ? error.message : "Could not load testers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTesters();
    const interval = setInterval(fetchTesters, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [refreshKey]);

  return { online, offline, loading, widgetError };
}