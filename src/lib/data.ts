import { supabase } from "@/integrations/supabase/client";

export type TierName = 'Unranked' | 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1';
export type GamemodeId = 'sword' | 'axe' | 'nethpot' | 'pot' | 'vanilla' | 'uhc' | 'smp' | 'mace';

export const TIER_POINTS: Record<TierName, number> = {
  Unranked: 0, LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6, HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60,
};

export const TIER_ORDER: TierName[] = ['Unranked','LT5','HT5','LT4','HT4','LT3','HT3','LT2','HT2','LT1','HT1'];

export const TIER_COLORS: Record<TierName, string> = {
  Unranked: 'tier-unranked',
  HT1: 'tier-ht1', HT2: 'tier-ht2', HT3: 'tier-ht3', HT4: 'tier-ht4', HT5: 'tier-ht5',
  LT1: 'tier-lt1', LT2: 'tier-lt2', LT3: 'tier-lt3', LT4: 'tier-lt4', LT5: 'tier-lt5',
};

export const TIER_GLASS_LABELS: Record<TierName, string> = {
  Unranked: 'Gray',
  HT1: 'Gold', HT2: 'Purple', HT3: 'Blue', HT4: 'Light Blue', HT5: 'Cyan',
  LT1: 'Green', LT2: 'Lime', LT3: 'Yellow', LT4: 'Orange', LT5: 'Red',
};

export interface Gamemode {
  id: GamemodeId;
  name: string;
  icon: string;
}

export const GAMEMODES: Gamemode[] = [
  { id: 'sword', name: 'Sword', icon: '⚔' },
  { id: 'axe', name: 'Axe', icon: '🪓' },
  { id: 'nethpot', name: 'NethPot', icon: '🔥' },
  { id: 'pot', name: 'Pot', icon: '🧪' },
  { id: 'vanilla', name: 'Vanilla', icon: '🌿' },
  { id: 'uhc', name: 'UHC', icon: '🏹' },
  { id: 'smp', name: 'SMP', icon: '🌍' },
  { id: 'mace', name: 'Mace', icon: '🔨' },
];

export interface Player {
  name: string;
  region: string;
  tiers: Record<GamemodeId, TierName>;
}

function calcPoints(tiers: Record<GamemodeId, TierName>): number {
  return Object.values(tiers).reduce((sum, t) => sum + TIER_POINTS[t], 0);
}

// Convert DB row to Player
function rowToPlayer(row: any): Player {
  return {
    name: row.name,
    region: row.region,
    tiers: {
      sword: row.tier_sword as TierName,
      axe: row.tier_axe as TierName,
      nethpot: row.tier_nethpot as TierName,
      pot: row.tier_pot as TierName,
      vanilla: row.tier_vanilla as TierName,
      uhc: row.tier_uhc as TierName,
      smp: row.tier_smp as TierName,
      mace: row.tier_mace as TierName,
    },
  };
}

// Convert Player to DB row fields
function playerToRow(player: Player) {
  return {
    name: player.name,
    region: player.region,
    tier_sword: player.tiers.sword,
    tier_axe: player.tiers.axe,
    tier_nethpot: player.tiers.nethpot,
    tier_pot: player.tiers.pot,
    tier_vanilla: player.tiers.vanilla,
    tier_uhc: player.tiers.uhc,
    tier_smp: player.tiers.smp,
    tier_mace: player.tiers.mace,
    updated_at: new Date().toISOString(),
  };
}

// ---- Cloud CRUD ----

export async function getPlayersCloud(): Promise<Player[]> {
  const { data, error } = await supabase.from('players').select('*');
  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }
  return (data || []).map(rowToPlayer);
}

export async function addPlayerCloud(player: Player): Promise<boolean> {
  const { error } = await supabase.from('players').insert(playerToRow(player));
  if (error) {
    console.error('Error adding player:', error);
    return false;
  }
  return true;
}

export async function updatePlayerCloud(originalName: string, player: Player): Promise<boolean> {
  const { error } = await supabase.from('players').update(playerToRow(player)).eq('name', originalName);
  if (error) {
    console.error('Error updating player:', error);
    return false;
  }
  return true;
}

export async function removePlayerCloud(name: string): Promise<boolean> {
  const { error } = await supabase.from('players').delete().eq('name', name);
  if (error) {
    console.error('Error removing player:', error);
    return false;
  }
  return true;
}

// ---- Sync: keep local functions for backward compat but use cloud ----

// Legacy localStorage functions (kept for migration, prefer cloud versions)
const STORAGE_KEY = 'pixel_tiers_players';

export function getPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Player[];
  } catch {
    return [];
  }
}

export function savePlayers(players: Player[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

export function addPlayer(player: Player): void {
  const players = getPlayers();
  players.push(player);
  savePlayers(players);
}

export function updatePlayer(originalName: string, player: Player): void {
  const players = getPlayers().map(p => p.name === originalName ? player : p);
  savePlayers(players);
}

export function removePlayer(name: string): void {
  savePlayers(getPlayers().filter(p => p.name !== name));
}

// ---- Ranked helpers (work with any Player[]) ----

export interface RankedPlayer extends Player {
  totalPoints: number;
  rank: number;
}

export function rankPlayers(players: Player[]): RankedPlayer[] {
  return players
    .map(p => ({ ...p, totalPoints: calcPoints(p.tiers), rank: 0 }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export function getRankedPlayers(): RankedPlayer[] {
  return rankPlayers(getPlayers());
}

export function getGamemodeLeaderboard(gm: GamemodeId, players?: Player[]): RankedPlayer[] {
  const list = players || getPlayers();
  return list
    .map(p => ({ ...p, totalPoints: TIER_POINTS[p.tiers[gm]], rank: 0 }))
    .sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name))
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export function getPlayerByName(name: string, players?: Player[]): RankedPlayer | undefined {
  const ranked = rankPlayers(players || getPlayers());
  return ranked.find(p => p.name.toLowerCase() === name.toLowerCase());
}

export function searchPlayers(query: string, players?: Player[]): Player[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return (players || getPlayers()).filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
}

export function getPlayerAvatarUrl(name: string): string {
  return `https://mc-heads.net/avatar/${name}/64`;
}

export function getPlayerBodyUrl(name: string): string {
  return `https://mc-heads.net/body/${name}/96`;
}

export function getPlayerHeadUrl(name: string): string {
  return `https://mc-heads.net/head/${name}/64`;
}
