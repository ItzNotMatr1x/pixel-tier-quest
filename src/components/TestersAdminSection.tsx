import { useState } from "react";
import { Headphones, Plus, Trash2, Save, Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTesters, useGuildId } from "@/hooks/useOnlineTesters";

export function TestersAdminSection() {
  const { testers, refresh } = useTesters();
  const { guildId, refresh: refreshGuild } = useGuildId();
  const [guildInput, setGuildInput] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const display = guildInput || guildId;

  const saveGuild = async () => {
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "discord_guild_id", value: (guildInput || guildId).trim(), updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) setMsg({ type: "err", text: error.message });
    else {
      setMsg({ type: "ok", text: "Guild ID saved." });
      setGuildInput("");
      refreshGuild();
    }
  };

  const addTester = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("testers")
      .insert({ discord_username: name.trim().replace(/^@/, ""), note: note.trim() || null });
    setSaving(false);
    if (error) setMsg({ type: "err", text: error.message });
    else {
      setName(""); setNote("");
      setMsg({ type: "ok", text: "Tester added." });
      refresh();
    }
  };

  const removeTester = async (id: string) => {
    if (!confirm("Remove this tester?")) return;
    const { error } = await supabase.from("testers").delete().eq("id", id);
    if (error) setMsg({ type: "err", text: error.message });
    else refresh();
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-lg text-foreground">Testers (Discord)</h2>
      </div>

      {/* Guild ID setting */}
      <div className="mb-6">
        <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <SettingsIcon className="w-3 h-3" /> Discord Server Guild ID
        </label>
        <div className="flex gap-2">
          <input
            value={guildInput}
            onChange={e => setGuildInput(e.target.value)}
            placeholder={guildId || "e.g. 1234567890123456789"}
            className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none flex-1 bg-transparent focus:ring-1 focus:ring-primary/50"
          />
          <button
            onClick={saveGuild}
            disabled={saving || !display.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground font-heading mt-1">
          Enable the widget in Discord: Server Settings → Widget → "Enable Server Widget".
        </p>
      </div>

      {/* Add tester */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Discord username (e.g. matrix)"
          className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none bg-transparent focus:ring-1 focus:ring-primary/50"
        />
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Role / note (optional)"
          className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none bg-transparent focus:ring-1 focus:ring-primary/50"
        />
        <button
          onClick={addTester}
          disabled={saving || !name.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {msg && (
        <div className={`mb-3 text-sm font-heading rounded-lg px-3 py-2 ${msg.type === "ok" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
          {msg.text}
        </div>
      )}

      {/* List */}
      {testers.length === 0 ? (
        <p className="text-sm text-muted-foreground font-heading">No testers yet.</p>
      ) : (
        <div className="divide-y divide-border/30">
          {testers.map(t => (
            <div key={t.id} className="flex items-center justify-between py-2.5 gap-3">
              <div className="min-w-0">
                <div className="font-heading font-bold text-sm text-foreground truncate">@{t.discord_username}</div>
                {t.note && <div className="text-xs text-muted-foreground truncate">{t.note}</div>}
              </div>
              <button
                onClick={() => removeTester(t.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
