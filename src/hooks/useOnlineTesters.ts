import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Tester = { id: string; discord_username: string; note: string | null };
export type WidgetMember = {
  id: string;
  username: string;
  discriminator?: string;
  avatar_url?: string;
  status?: string;
};
export type OnlineTester = Tester & { member: WidgetMember };

const norm = (s: string) => s.trim().toLowerCase().replace(/^@/, "");

export function useGuildId() {
  const [guildId, setGuildId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "discord_guild_id")
      .maybeSingle();
    setGuildId(data?.value ?? "");
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { guildId, loading, refresh, setGuildId };
}

export function useTesters() {
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testers")
      .select("id, discord_username, note")
      .order("discord_username");
    setTesters((data ?? []) as Tester[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { testers, loading, refresh };
}

export function useOnlineTesters() {
  const { guildId, loading: guildLoading } = useGuildId();
  const { testers, loading: testersLoading } = useTesters();
  const [online, setOnline] = useState<OnlineTester[]>([]);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildLoading || testersLoading) return;
    let cancelled = false;

    const fetchWidget = async () => {
      setLoading(true);
      setWidgetError(null);
      if (!guildId) {
        setOnline([]);
        setLoading(false);
        setWidgetError("Discord Guild ID not configured");
        return;
      }
      try {
        const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
        if (!res.ok) throw new Error("Widget unavailable (enable it in Discord Server Settings)");
        const json = await res.json();
        const members: WidgetMember[] = json.members ?? [];
        const map = new Map(members.map(m => [norm(m.username), m]));
        const matched: OnlineTester[] = testers
          .map(t => {
            const m = map.get(norm(t.discord_username));
            return m ? { ...t, member: m } : null;
          })
          .filter(Boolean) as OnlineTester[];
        if (!cancelled) setOnline(matched);
      } catch (e: any) {
        if (!cancelled) {
          setOnline([]);
          setWidgetError(e?.message ?? "Failed to load Discord widget");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWidget();
    const id = setInterval(fetchWidget, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [guildId, guildLoading, testers, testersLoading]);

  return { online, loading, widgetError, guildId };
}
