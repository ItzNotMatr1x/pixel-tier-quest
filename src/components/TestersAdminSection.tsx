import { useState } from "react";
import { Headphones, Plus, Trash2, Save, Settings as SettingsIcon, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { DisplayTester, useOnlineTesters, useTesters, useGuildId } from "@/hooks/useOnlineTesters";

export function TestersAdminSection() {
  const { testers, refresh } = useTesters();
  const { guildId, roleId, refresh: refreshSettings } = useGuildId();
  const [guildInput, setGuildInput] = useState<string | null>(null);
  const [roleInput, setRoleInput] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { online, offline, loading, widgetError } = useOnlineTesters(refreshKey);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const saveSettings = async () => {
    const nextGuild = (guildInput ?? guildId).trim();
    const nextRole = (roleInput ?? roleId).trim();
    if (!/^\d{17,20}$/.test(nextGuild) || (nextRole && !/^\d{17,20}$/.test(nextRole))) {
      setMsg({ type: "err", text: "Enter a valid Discord Server ID and Role ID (or leave Role ID empty)." });
      return;
    }
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.from("app_settings").upsert([
      { key: "discord_guild_id", value: nextGuild, updated_at: new Date().toISOString() },
      { key: "discord_tester_role_id", value: nextRole, updated_at: new Date().toISOString() },
    ]);
    setSaving(false);
    if (error) setMsg({ type: "err", text: error.message });
    else {
      setMsg({ type: "ok", text: "Discord settings saved." });
      setGuildInput(null);
      setRoleInput(null);
      refreshSettings();
      setRefreshKey(key => key + 1);
    }
  };

  const addTester = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.from("testers")
      .insert({ discord_username: name.trim().replace(/^@/, ""), note: note.trim() || null });
    setSaving(false);
    if (error) setMsg({ type: "err", text: error.message });
    else {
      setName(""); setNote("");
      setMsg({ type: "ok", text: "Tester added." });
      refresh();
      setRefreshKey(key => key + 1);
    }
  };

  const removeTester = async (id: string) => {
    if (!confirm("Remove this tester?")) return;
    const { error } = await supabase.from("testers").delete().eq("id", id);
    if (error) setMsg({ type: "err", text: error.message });
    else { refresh(); setRefreshKey(key => key + 1); }
  };

  const testerRow = (tester: DisplayTester) => (
    <div key={tester.id} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0 min-w-0">
      <div className="relative shrink-0">
        {tester.avatar_url ? (
          <img src={tester.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"><UserRound className="h-5 w-5" /></div>
        )}
        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${tester.online ? "bg-primary" : "bg-muted-foreground"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-heading font-bold text-sm text-foreground truncate">{tester.username}</div>
        <div className="text-xs text-muted-foreground truncate">{tester.note || (tester.source === "role" ? "Discord role" : "Added manually")}</div>
      </div>
      {tester.source === "manual" && (
        <Button onClick={() => removeTester(tester.id)} size="icon" variant="ghost" className="shrink-0 text-muted-foreground hover:text-destructive" title="Remove tester" aria-label={`Remove ${tester.username}`}>
          <Trash2 />
        </Button>
      )}
    </div>
  );

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-lg text-foreground">Testers (Discord)</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="discord-guild" className="text-xs font-heading text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
            <SettingsIcon className="w-3 h-3" /> Discord Server ID
          </label>
          <input id="discord-guild" value={guildInput ?? guildId} onChange={event => setGuildInput(event.target.value)} placeholder="Server ID" inputMode="numeric" className="glass-card px-4 py-2 text-sm text-foreground outline-none w-full bg-transparent focus:ring-1 focus:ring-primary/50" />
        </div>
        <div>
          <label htmlFor="discord-role" className="text-xs font-heading text-muted-foreground uppercase mb-1 block">Tester Role ID</label>
          <input id="discord-role" value={roleInput ?? roleId} onChange={event => setRoleInput(event.target.value)} placeholder="Optional role ID" inputMode="numeric" className="glass-card px-4 py-2 text-sm text-foreground outline-none w-full bg-transparent focus:ring-1 focus:ring-primary/50" />
        </div>
      </div>
      <Button onClick={saveSettings} disabled={saving || !(guildInput ?? guildId).trim()} size="sm" className="mb-2"><Save /> Save settings</Button>
      <p className="text-xs text-muted-foreground mb-6">People with the selected role appear automatically. Enable Server Settings → Widget in Discord for online status.</p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
        <input value={name} onChange={event => setName(event.target.value)} placeholder="Discord username" aria-label="Discord username" className="glass-card px-4 py-2 text-sm text-foreground outline-none bg-transparent focus:ring-1 focus:ring-primary/50" />
        <input value={note} onChange={event => setNote(event.target.value)} placeholder="Note (optional)" aria-label="Tester note" className="glass-card px-4 py-2 text-sm text-foreground outline-none bg-transparent focus:ring-1 focus:ring-primary/50" />
        <Button onClick={addTester} disabled={saving || !name.trim()}><Plus /> Add tester</Button>
      </div>

      {msg && <p role="status" className={`mb-3 text-sm font-heading ${msg.type === "ok" ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
      {widgetError && <p role="status" className="mb-3 text-sm text-muted-foreground">{widgetError}</p>}
      {loading ? <p className="text-sm text-muted-foreground">Loading testers…</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display text-sm text-foreground mb-2">Online testers ({online.length})</h3>
            {online.length ? online.map(testerRow) : <p className="text-sm text-muted-foreground">No testers online.</p>}
          </div>
          <div>
            <h3 className="font-display text-sm text-foreground mb-2">Offline testers ({offline.length})</h3>
            {offline.length ? offline.map(testerRow) : <p className="text-sm text-muted-foreground">No testers offline.</p>}
          </div>
        </div>
      )}
    </div>
  );
}