export type TierName = 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1';
export type GamemodeId = 'sword' | 'axe' | 'nethpot' | 'pot' | 'vanilla' | 'uhc' | 'smp' | 'mace';

export const TIER_POINTS: Record<TierName, number> = {
  LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6, HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60,
};

export const TIER_ORDER: TierName[] = ['LT5','HT5','LT4','HT4','LT3','HT3','LT2','HT2','LT1','HT1'];

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

function calcPoints(tiers: Record<GamemodeId, TierName>): number {
  return Object.values(tiers).reduce((sum, t) => sum + TIER_POINTS[t], 0);
}

const randomTier = (): TierName => TIER_ORDER[Math.floor(Math.random() * TIER_ORDER.length)];
const regions = ['NA', 'EU', 'AS', 'SA', 'OCE'];

const PLAYER_NAMES = [
  'Technoblade', 'Dream', 'Sapnap', 'Fruitberries', 'Illumina',
  'Tapl', 'Purpled', 'Stimpy', 'Danteh', 'Calvin',
  'Huahwi', 'Stimpay', 'Tylarzz', 'Apexay', 'Verzide',
  'Intel_Edits', 'Zyphen', 'Cxlvxn', 'Sweatgod', 'Manhal_IQ',
  'xNestorio', 'Kiingtong', 'Grapeapplesauce', 'Bashur', 'ShotGunRaids',
  'Cayden', 'Suchspeed', 'Dreaaam', 'FireBreathMan', 'Luvonox',
  'Ziblacking', 'iRapture', 'P0LAND', 'Cscoop', 'Samot',
  'BiboyQG', 'xJerry', 'Mweepins', 'Kreos', 'painfulpvp',
  'Zyph', 'NoHaxJustSumo', 'YungSavage', 'Strafe', 'ComboDombo',
  'VelvetPvP', 'AciDic_BliTzz', 'iTMG', 'Jdegoeansen', 'Pack',
  'Crazyyy', 'MiDAS', 'zMqrk', 'vBlazin', 'Tewrts',
  'iSlayOnMC', 'Reclined', 'PainfulPvP', 'StrafeGOD', 'LeoZ',
  'Swimfan72', 'BreadWinnerss', 'Unmaking', 'HanielMC', 'Kiinq',
  'W0T', 'ItzJuan', 'KinePvP', 'Serge', 'MarleyMoo',
  'pvplegend99', 'GhostBlaze', 'NetherKing_X', 'SkyAxe', 'FlameRush',
  'BlazeStrike', 'IceVenom', 'CrystalAxe', 'ShadowPot', 'VoidSword',
  'ThunderMace', 'FrostBow', 'PixelKnight', 'DiamondClash', 'ObsidianPvP',
  'EnderStriker', 'RedstoneGod', 'CreeperSlayer', 'WitherKing', 'DragonPulse',
  'GlitchBlade', 'PrismPvP', 'NeonStrike', 'ZenithBow', 'AuroraMace',
  'EclipseAxe', 'CosmicPot', 'NovaSword', 'VortexPvP', 'QuantumBlade',
];

// Featured players with specific high tiers
const FEATURED: Player[] = [
  { name: 'Technoblade', region: 'NA', tiers: { sword: 'HT1', axe: 'HT1', nethpot: 'HT2', pot: 'HT1', vanilla: 'HT1', uhc: 'HT1', smp: 'HT2', mace: 'HT1' }},
  { name: 'Dream', region: 'NA', tiers: { sword: 'HT1', axe: 'HT2', nethpot: 'HT1', pot: 'HT2', vanilla: 'HT1', uhc: 'HT2', smp: 'HT1', mace: 'HT2' }},
  { name: 'Fruitberries', region: 'NA', tiers: { sword: 'HT2', axe: 'HT1', nethpot: 'HT2', pot: 'HT1', vanilla: 'HT2', uhc: 'HT1', smp: 'HT1', mace: 'HT1' }},
  { name: 'Sapnap', region: 'NA', tiers: { sword: 'HT1', axe: 'HT1', nethpot: 'HT3', pot: 'HT1', vanilla: 'HT2', uhc: 'HT2', smp: 'HT2', mace: 'LT1' }},
  { name: 'Illumina', region: 'NA', tiers: { sword: 'HT2', axe: 'HT2', nethpot: 'HT1', pot: 'HT2', vanilla: 'HT1', uhc: 'HT1', smp: 'HT2', mace: 'HT2' }},
];

const usedNames = new Set(FEATURED.map(p => p.name));
const remainingNames = PLAYER_NAMES.filter(n => !usedNames.has(n));

export const MOCK_PLAYERS: Player[] = [
  ...FEATURED,
  ...remainingNames.map(name => ({
    name,
    region: regions[Math.floor(Math.random() * regions.length)],
    tiers: Object.fromEntries(GAMEMODES.map(g => [g.id, randomTier()])) as Record<GamemodeId, TierName>,
  })),
];

export interface RankedPlayer extends Player {
  totalPoints: number;
  rank: number;
}

export function getRankedPlayers(): RankedPlayer[] {
  return MOCK_PLAYERS
    .map(p => ({ ...p, totalPoints: calcPoints(p.tiers), rank: 0 }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export function getGamemodeLeaderboard(gm: GamemodeId): RankedPlayer[] {
  return MOCK_PLAYERS
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
  return MOCK_PLAYERS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
}

export function getPlayerAvatarUrl(name: string): string {
  return `https://mc-heads.net/avatar/${name}/64`;
}

export function getPlayerHeadUrl(name: string): string {
  return `https://mc-heads.net/head/${name}/64`;
}
