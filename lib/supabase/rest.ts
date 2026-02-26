import "server-only";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type ReadingSessionInsert = {
  email?: string | null;
  first_name?: string | null;
  locale?: string;
  lumia_question: string;
  lumia_context?: Json;
  lumia_output_md: string;
  lumia_summary_json: Json;
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to store Lumia sessions."
    );
  }

  return {
    supabaseUrl,
    serviceRoleKey,
  };
}

export async function insertReadingSession(payload: ReadingSessionInsert) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  const response = await fetch(`${supabaseUrl}/rest/v1/reading_sessions`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${errorBody}`);
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  const session = rows[0];

  if (!session?.id) {
    throw new Error(
      "Supabase insert succeeded but no session id was returned."
    );
  }

  return session.id;
}
