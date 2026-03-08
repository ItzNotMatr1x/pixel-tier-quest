
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL DEFAULT 'NA',
  tier_sword TEXT NOT NULL DEFAULT 'Unranked',
  tier_axe TEXT NOT NULL DEFAULT 'Unranked',
  tier_nethpot TEXT NOT NULL DEFAULT 'Unranked',
  tier_pot TEXT NOT NULL DEFAULT 'Unranked',
  tier_vanilla TEXT NOT NULL DEFAULT 'Unranked',
  tier_uhc TEXT NOT NULL DEFAULT 'Unranked',
  tier_smp TEXT NOT NULL DEFAULT 'Unranked',
  tier_mace TEXT NOT NULL DEFAULT 'Unranked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Public read access for everyone (leaderboard is public)
CREATE POLICY "Anyone can read players" ON public.players FOR SELECT USING (true);

-- Authenticated users can insert/update/delete (admin)
CREATE POLICY "Authenticated users can insert players" ON public.players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update players" ON public.players FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete players" ON public.players FOR DELETE TO authenticated USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
