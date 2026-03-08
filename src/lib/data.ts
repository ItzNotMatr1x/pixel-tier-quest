export type TierName = 'Unranked' | 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1';
export type GamemodeId = 'sword' | 'axe' | 'nethpot' | 'pot' | 'vanilla' | 'uhc' | 'smp' | 'mace';

export const TIER_POINTS: Record<TierName, number> = {
  Unranked: 0, LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6, HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60,
};

export const TIER_ORDER: TierName[] = ['Unranked','LT5','HT5','LT4','HT4','LT3','HT3','LT2','HT2','LT1','HT1'];

export const TIER_COLORS: Record<TierName, string> = {
  HT1: 'tier-ht1', HT2: 'tier-ht2', HT3: 'tier-ht3', HT4: 'tier-ht4', HT5: 'tier-ht5',
  LT1: 'tier-lt1', LT2: 'tier-lt2', LT3: 'tier-lt3', LT4: 'tier-lt4', LT5: 'tier-lt5',
};

export const TIER_GLASS_LABELS: Record<TierName, string> = {
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

const STORAGE_KEY = 'pixel_tiers_players';

function calcPoints(tiers: Record<GamemodeId, TierName>): number {
  return Object.values(tiers).reduce((sum, t) => sum + TIER_POINTS[t], 0);
}

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

export interface RankedPlayer extends Player {
  totalPoints: number;
  rank: number;
}

export function getRankedPlayers(): RankedPlayer[] {
  return getPlayers()
    .map(p => ({ ...p, totalPoints: calcPoints(p.tiers), rank: 0 }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export function getGamemodeLeaderboard(gm: GamemodeId): RankedPlayer[] {
  return getPlayers()
    .map(p => ({ ...p, totalPoints: TIER_POINTS[p.tiers[gm]], rank: 0 }))
    .sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name))
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export function getPlayerByName(name: string): RankedPlayer | undefined {
  const ranked = getRankedPlayers();
  return ranked.find(p => p.name.toLowerCase() === name.toLowerCase());
}

export function searchPlayers(query: string): Player[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return getPlayers().filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
}

export function getPlayerAvatarUrl(name: string): string {
  return `https://mc-heads.net/avatar/${name}/64`;
}

export function getPlayerBodyUrl(name: string): string {
  return `https://mc-heads.net/body/${name}/128`;
}

export function getPlayerHeadUrl(name: string): string {
  return `https://mc-heads.net/head/${name}/64`;
}
