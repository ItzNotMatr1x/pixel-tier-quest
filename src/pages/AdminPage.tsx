import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { usePlayers } from "@/hooks/usePlayers";
import {
  Player, GAMEMODES, TIER_ORDER, GamemodeId, TierName
} from "@/lib/data";
import { PlayerHead } from "@/components/PlayerHead";
import { GamemodeIcon } from "@/components/GamemodeIcon";
import { Shield, Plus, Trash2, Pencil, Save, X, Users, LogOut, Cloud } from "lucide-react";

const REGIONS = ['NA', 'EU', 'AS', 'SA', 'OCE'];

const defaultTiers = (): Record<GamemodeId, TierName> =>
  Object.fromEntries(GAMEMODES.map(g => [g.id, 'Unranked'])) as Record<GamemodeId, TierName>;

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { players, loading: playersLoading, addPlayer, updatePlayer, removePlayer } = usePlayers();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Player>({ name: '', region: 'NA', tiers: defaultTiers() });
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    if (players.some(p => p.name.toLowerCase() === form.name.toLowerCase())) return;
    setSaving(true);
    await addPlayer({ ...form, name: form.name.trim() });
    setForm({ name: '', region: 'NA', tiers: defaultTiers() });
    setAdding(false);
    setSaving(false);
  };

  const handleUpdate = async (originalName: string) => {
    if (!form.name.trim()) return;
    setSaving(true);
    await updatePlayer(originalName, { ...form, name: form.name.trim() });
    setEditing(null);
    setForm({ name: '', region: 'NA', tiers: defaultTiers() });
    setSaving(false);
  };

  const handleDelete = async (name: string) => {
    await removePlayer(name);
  };

  const startEdit = (player: Player) => {
    setEditing(player.name);
    setForm({ ...player, tiers: { ...player.tiers } });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ name: '', region: 'NA', tiers: defaultTiers() });
  };

  const cancel = () => {
    setEditing(null);
    setAdding(false);
    setForm({ name: '', region: 'NA', tiers: defaultTiers() });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-primary" />
          <h1 className="font-display font-bold text-3xl text-foreground">Admin Panel</h1>
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold text-sm hover:bg-secondary/80 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
      <p className="text-muted-foreground font-heading mb-6">
        Logged in as <span className="text-primary">{user.email}</span>
      </p>

      {/* Stats */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-heading text-foreground">
            <span className="font-bold">{players.length}</span> players registered
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-heading text-primary">
          <Cloud className="w-4 h-4" />
          <span>Cloud Synced</span>
        </div>
      </div>

      {/* Add button */}
      {!adding && !editing && (
        <button
          onClick={startAdd}
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Player
        </button>
      )}

      {/* Add/Edit Form */}
      {(adding || editing) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 glow-cyan"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-4">
            {adding ? 'Add New Player' : `Editing: ${editing}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1 block">Player Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Minecraft username"
                className="glass-card px-4 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full bg-transparent focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1 block">Region</label>
              <select
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
                className="glass-card px-4 py-2 text-sm font-body text-foreground outline-none w-full bg-transparent focus:ring-1 focus:ring-primary/50"
              >
                {REGIONS.map(r => <option key={r} value={r} className="bg-card text-foreground">{r}</option>)}
              </select>
            </div>
          </div>

          <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-3 block">Gamemode Tiers</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {GAMEMODES.map(gm => (
              <div key={gm.id} className="glass-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{gm.icon}</span>
                  <span className="font-heading font-bold text-foreground text-sm">{gm.name}</span>
                </div>
                <select
                  value={form.tiers[gm.id]}
                  onChange={e => setForm({
                    ...form,
                    tiers: { ...form.tiers, [gm.id]: e.target.value as TierName }
                  })}
                  className="w-full px-3 py-1.5 rounded-lg text-sm font-heading bg-secondary/50 text-foreground outline-none border border-border/50 focus:ring-1 focus:ring-primary/50"
                >
                  {TIER_ORDER.map(t => (
                    <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={adding ? handleAdd : () => handleUpdate(editing!)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : adding ? 'Add Player' : 'Save Changes'}
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold hover:bg-secondary/80 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Player List */}
      {playersLoading ? (
        <div className="glass-card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : players.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No Players Yet</h3>
          <p className="text-muted-foreground font-heading text-sm">Click "Add Player" to start building your leaderboard.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_60px_60px_80px] md:grid-cols-[48px_1fr_80px_80px_100px] gap-2 px-4 py-3 border-b border-border/50 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
            <span></span>
            <span>Player</span>
            <span>Region</span>
            <span className="text-right">Pts</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-border/30">
            {players.map((player, i) => {
              const pts = Object.values(player.tiers).reduce((s, t) => s + (({ LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6, HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60 } as Record<string, number>)[t] || 0), 0);
              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="grid grid-cols-[40px_1fr_60px_60px_80px] md:grid-cols-[48px_1fr_80px_80px_100px] gap-2 px-4 py-3 items-center hover:bg-secondary/20 transition-colors"
                >
                  <PlayerHead name={player.name} size={32} />
                  <span className="font-heading font-bold text-foreground text-sm truncate">{player.name}</span>
                  <span className="text-xs text-muted-foreground">{player.region}</span>
                  <span className="font-display font-bold text-primary text-sm text-right">{pts}</span>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => startEdit(player)}
                      className="p-1.5 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(player.name)}
                      className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
