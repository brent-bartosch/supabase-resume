import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if env vars are available
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types for our resume tables
export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  updated_at: string;
};

export type Section = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
};

export type Item = {
  id: string;
  section_id: string;
  sort_order: number;
  item_type: string;
  org: string | null;
  role: string | null;
  dates: string | null;
  location: string | null;
  body: string;
};

export type Stat = {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  sort_order: number;
};
