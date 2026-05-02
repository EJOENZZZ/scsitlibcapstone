import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "scsit-auth",
  },
});

export const getAuthUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
