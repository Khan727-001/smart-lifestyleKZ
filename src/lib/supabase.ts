import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? `https://${projectId}.supabase.co`;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Review = {
  id: string;
  name: string;
  specialist: string;
  text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type PricingCondition = {
  id: string;
  plan_id: string;
  text: string;
  sort_order: number;
  is_active: boolean;
};

export type PricingPlan = {
  plan_id: string;
  price_kzt: string;
  price_usd: string;
};
