import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

type DiscordMember = {
  nick?: string | null;
  roles: string[];
  user: { id: string; username: string; global_name?: string | null; avatar?: string | null; bot?: boolean };
};
type WidgetMember = { username: string; avatar_url?: string; status?: string };
type Tester = { id: string; discord_username: string; note: string | null };
type DisplayTester = { id: string; username: string; note: string | null; avatar_url: string | null; online: boolean; source: 'manual' | 'role' };

const gateway = 'https://connector-gateway.lovable.dev/discord';
const snowflake = /^\d{17,20}$/;
const normalize = (value: string) => value.trim().replace(/^@/, '').toLowerCase();
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=45' },
});
let cache: { key: string; until: number; body: unknown } | null = null;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);

  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const discordKey = Deno.env.get('DISCORD_API_KEY');
    if (!url || !serviceKey || !lovableKey || !discordKey) return reply({ error: 'Discord connection is not configured' }, 503);

    const db = createClient(url, serviceKey);
    const [settingsResult, testersResult] = await Promise.all([
      db.from('app_settings').select('key, value').in('key', ['discord_guild_id', 'discord_tester_role_id']),
      db.from('testers').select('id, discord_username, note').order('discord_username'),
    ]);
    if (settingsResult.error || testersResult.error) return reply({ error: 'Could not load tester settings' }, 500);
    const settings = Object.fromEntries((settingsResult.data ?? []).map(row => [row.key, row.value ?? '']));
    const guildId = settings.discord_guild_id;
    const roleId = settings.discord_tester_role_id;
    if (!guildId || !snowflake.test(guildId)) return reply({ error: 'Set a valid Discord Server Guild ID in the admin panel' }, 400);
    if (roleId && !snowflake.test(roleId)) return reply({ error: 'Set a valid tester Role ID in the admin panel' }, 400);

    const testers = (testersResult.data ?? []) as Tester[];
    const cacheKey = JSON.stringify([guildId, roleId, testers]);
    if (cache?.key === cacheKey && cache.until > Date.now()) return reply(cache.body);

    const headers = { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': discordKey };
    const members: DiscordMember[] = [];
    let after = '';
    for (let page = 0; page < 20; page++) {
      const query = new URLSearchParams({ limit: '1000' });
      if (after) query.set('after', after);
      const response = await fetch(`${gateway}/guilds/${guildId}/members?${query}`, { headers });
      if (!response.ok) {
        const details = await response.text();
        console.error(`Discord members failed [${response.status}]: ${details}`);
        return reply({ error: 'Discord member lookup failed', status: response.status, details }, response.status);
      }
      const batch = await response.json() as DiscordMember[];
      members.push(...batch);
      if (batch.length < 1000) break;
      after = batch[batch.length - 1]?.user?.id ?? '';
      if (!after || page === 19) return reply({ error: 'Discord server is too large to list all testers' }, 503);
    }

    let widget: WidgetMember[] = [];
    let widgetError: string | null = null;
    try {
      const response = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
      if (!response.ok) throw new Error('Enable the public server widget in Discord to show online status');
      const json = await response.json();
      widget = Array.isArray(json.members) ? json.members : [];
    } catch (error) {
      widgetError = error instanceof Error ? error.message : 'Discord widget unavailable';
    }

    const onlineNames = new Set(widget.flatMap(member => [normalize(member.username)]));
    const byName = new Map<string, DiscordMember>();
    for (const member of members) {
      for (const value of [member.user.username, member.user.global_name, member.nick]) {
        if (value) byName.set(normalize(value), member);
      }
    }
    const result = new Map<string, DisplayTester>();
    const makeTester = (member: DiscordMember, id: string, note: string | null, source: 'manual' | 'role'): DisplayTester => {
      const names = [member.user.username, member.user.global_name, member.nick].filter((value): value is string => !!value);
      return {
        id, username: member.user.username, note,
        avatar_url: member.user.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.${member.user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128` : null,
        online: names.some(name => onlineNames.has(normalize(name))), source,
      };
    };

    for (const tester of testers) {
      const member = byName.get(normalize(tester.discord_username));
      if (member) result.set(member.user.id, makeTester(member, tester.id, tester.note, 'manual'));
      else result.set(`manual:${tester.id}`, {
        id: tester.id, username: tester.discord_username, note: tester.note,
        avatar_url: null, online: false, source: 'manual',
      });
    }
    if (roleId) {
      for (const member of members) {
        if (member.roles.includes(roleId) && !member.user.bot && !result.has(member.user.id)) {
          result.set(member.user.id, makeTester(member, `role:${member.user.id}`, null, 'role'));
        }
      }
    }
    const all = Array.from(result.values()).sort((a, b) => a.username.localeCompare(b.username));
    const body = { online: all.filter(tester => tester.online), offline: all.filter(tester => !tester.online), widgetError };
    cache = { key: cacheKey, until: Date.now() + 60_000, body };
    return reply(body);
  } catch (error) {
    console.error('Discord tester lookup failed:', error);
    return reply({ error: error instanceof Error ? error.message : 'Could not load testers' }, 500);
  }
});