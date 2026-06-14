import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { isOwnerEmail } from "../_shared/owners.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { user_id } = await req.json();
    if (!user_id) return json({ error: "user_id required" }, 400);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing auth" }, 401);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    if (!isOwnerEmail(userData.user.email)) {
      return json({ error: "Forbidden: owners only" }, 403);
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Don't allow deleting an owner account
    const { data: target } = await admin.auth.admin.getUserById(user_id);
    if (isOwnerEmail(target?.user?.email)) {
      return json({ error: "Cannot remove an owner account" }, 403);
    }

    // Remove role rows then delete the auth user
    const { error: roleErr } = await admin
      .from("user_roles")
      .delete()
      .eq("user_id", user_id);
    if (roleErr) return json({ error: roleErr.message }, 400);

    const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
    if (delErr) return json({ error: delErr.message }, 400);

    return json({ success: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
