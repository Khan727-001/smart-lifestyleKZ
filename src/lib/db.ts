import { supabase, Review, PricingCondition, PricingPlan } from "./supabase";

// ── Reviews ──────────────────────────────────────────────────

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addReview(r: Omit<Review, "id" | "created_at">): Promise<Review> {
  const { data, error } = await supabase.from("reviews").insert(r).select().single();
  if (error) throw error;
  return data;
}

export async function updateReview(id: string, patch: Partial<Review>): Promise<void> {
  const { error } = await supabase.from("reviews").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderReviews(ids: string[]): Promise<void> {
  const updates = ids.map((id, i) => supabase.from("reviews").update({ sort_order: i }).eq("id", id));
  await Promise.all(updates);
}

// ── Pricing conditions ───────────────────────────────────────

export async function fetchPricingConditions(): Promise<PricingCondition[]> {
  const { data, error } = await supabase
    .from("pricing_conditions")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllPricingConditions(): Promise<PricingCondition[]> {
  const { data, error } = await supabase
    .from("pricing_conditions")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addPricingCondition(c: Omit<PricingCondition, "id">): Promise<PricingCondition> {
  const { data, error } = await supabase.from("pricing_conditions").insert(c).select().single();
  if (error) throw error;
  return data;
}

export async function updatePricingCondition(id: string, patch: Partial<PricingCondition>): Promise<void> {
  const { error } = await supabase.from("pricing_conditions").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deletePricingCondition(id: string): Promise<void> {
  const { error } = await supabase.from("pricing_conditions").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderPricingConditions(ids: string[]): Promise<void> {
  const updates = ids.map((id, i) => supabase.from("pricing_conditions").update({ sort_order: i }).eq("id", id));
  await Promise.all(updates);
}

// ── Pricing plans (цены) ─────────────────────────────────────

export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const { data, error } = await supabase.from("pricing_plans").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function updatePricingPlan(plan_id: string, patch: Partial<PricingPlan>): Promise<void> {
  const { error } = await supabase.from("pricing_plans").update(patch).eq("plan_id", plan_id);
  if (error) throw error;
}
