import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "apikey"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const adminClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const cleanText = (value: unknown, maxLength = 500) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const optionalText = (value: unknown, maxLength = 500) => {
  const text = cleanText(value, maxLength);
  return text || null;
};

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

app.get("/make-server-733add02/health", (c) => c.json({ status: "ok" }));

// Создание таблиц и RLS (вызвать один раз из /admin → Settings)
app.post("/make-server-733add02/init-db", async (c) => {
  const supabase = adminClient();
  const sql = `
    create table if not exists public.reviews (
      id uuid primary key default gen_random_uuid(),
      request_id text,
      name text not null,
      specialist text not null default 'S.M.A.R.T. Lifestyle',
      text text not null,
      sort_order integer not null default 0,
      is_active boolean not null default true,
      created_at timestamptz default now()
    );

    create table if not exists public.pricing_conditions (
      id uuid primary key default gen_random_uuid(),
      plan_id text not null,
      text text not null,
      sort_order integer not null default 0,
      is_active boolean not null default true
    );

    create table if not exists public.leads (
      id uuid primary key default gen_random_uuid(),
      request_id text,
      name text not null,
      phone text not null,
      message text,
      source text not null default 'website',
      page_url text,
      utm_source text,
      utm_medium text,
      utm_campaign text,
      utm_content text,
      utm_term text,
      gclid text,
      telegram_sent boolean not null default false,
      telegram_message_id bigint,
      created_at timestamptz not null default now()
    );

    alter table public.leads add column if not exists request_id text;
    create unique index if not exists leads_request_id_uidx on public.leads (request_id) where request_id is not null;

    alter table public.reviews enable row level security;
    alter table public.pricing_conditions enable row level security;
    alter table public.leads enable row level security;

    do $$ begin
      if not exists (
        select 1 from pg_policies where tablename = 'reviews' and policyname = 'public_read_reviews'
      ) then
        create policy public_read_reviews on public.reviews
          for select using (is_active = true);
      end if;

      if not exists (
        select 1 from pg_policies where tablename = 'reviews' and policyname = 'auth_all_reviews'
      ) then
        create policy auth_all_reviews on public.reviews
          for all using (auth.uid() is not null);
      end if;

      if not exists (
        select 1 from pg_policies where tablename = 'pricing_conditions' and policyname = 'public_read_pricing'
      ) then
        create policy public_read_pricing on public.pricing_conditions
          for select using (is_active = true);
      end if;

      if not exists (
        select 1 from pg_policies where tablename = 'pricing_conditions' and policyname = 'auth_all_pricing'
      ) then
        create policy auth_all_pricing on public.pricing_conditions
          for all using (auth.uid() is not null);
      end if;
    end $$;
  `;

  const { error } = await supabase.rpc("exec_sql", { query: sql }).maybeSingle();
  if (error) {
    return c.json({ ok: false, hint: "Run the SQL manually in Supabase Dashboard SQL editor", sql });
  }
  return c.json({ ok: true });
});

app.post("/make-server-733add02/lead", async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "Некорректные данные формы" }, 400);
  }

  // Honeypot: обычный посетитель это поле не видит и не заполняет.
  if (cleanText(body.website, 200)) {
    return c.json({ ok: false, error: "Заявка отклонена" }, 400);
  }

  const requestId = cleanText(body.requestId, 120) || crypto.randomUUID();
  const name = cleanText(body.name, 120);
  const phone = cleanText(body.phone, 60);
  const message = optionalText(body.message, 1500);
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2 || phoneDigits.length < 7) {
    return c.json({ ok: false, error: "Укажите имя и корректный телефон" }, 400);
  }

  const lead = {
    request_id: requestId,
    name,
    phone,
    message,
    source: cleanText(body.source, 120) || "website",
    page_url: optionalText(body.pageUrl, 1000),
    utm_source: optionalText(body.utmSource, 255),
    utm_medium: optionalText(body.utmMedium, 255),
    utm_campaign: optionalText(body.utmCampaign, 255),
    utm_content: optionalText(body.utmContent, 255),
    utm_term: optionalText(body.utmTerm, 255),
    gclid: optionalText(body.gclid, 500),
  };

  const supabase = adminClient();
  let { data: savedLead, error: lookupError } = await supabase
    .from("leads")
    .select("id, created_at, telegram_sent")
    .eq("request_id", requestId)
    .maybeSingle();

  if (lookupError) {
    console.error("Lead lookup failed", lookupError);
    return c.json({ ok: false, error: "Не удалось проверить заявку" }, 500);
  }

  if (!savedLead) {
    const { data, error: insertError } = await supabase
      .from("leads")
      .insert(lead)
      .select("id, created_at, telegram_sent")
      .single();

    if (insertError || !data) {
      console.error("Lead insert failed", insertError);
      return c.json({ ok: false, error: "Не удалось сохранить заявку" }, 500);
    }
    savedLead = data;
  }

  // Повторный запрос после уже успешной отправки не создает дубль в Telegram.
  if (savedLead.telegram_sent) {
    return c.json({ ok: true, leadId: savedLead.id });
  }

  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!botToken || !chatId) {
    console.error("Telegram secrets are not configured");
    return c.json({
      ok: false,
      leadId: savedLead.id,
      error: "Заявка сохранена, но Telegram пока не настроен",
    }, 503);
  }

  const createdAt = new Date(savedLead.created_at).toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    dateStyle: "short",
    timeStyle: "short",
  });

  const attribution = [
    lead.utm_source ? `utm_source: ${escapeHtml(lead.utm_source)}` : null,
    lead.utm_medium ? `utm_medium: ${escapeHtml(lead.utm_medium)}` : null,
    lead.utm_campaign ? `utm_campaign: ${escapeHtml(lead.utm_campaign)}` : null,
    lead.gclid ? `gclid: ${escapeHtml(lead.gclid)}` : null,
  ].filter(Boolean).join("\n");

  const telegramText = [
    "🔔 <b>Новый лид — S.M.A.R.T. Lifestyle</b>",
    "",
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📱 <b>Телефон:</b> ${escapeHtml(phone)}`,
    message ? `💬 <b>Запрос:</b> ${escapeHtml(message)}` : null,
    "",
    `🌐 <b>Источник:</b> ${escapeHtml(lead.source)}`,
    lead.page_url ? `📍 <b>Страница:</b> ${escapeHtml(lead.page_url)}` : null,
    attribution ? `📊 <b>Реклама:</b>\n${attribution}` : null,
    `🕐 <b>Время:</b> ${escapeHtml(createdAt)} (Алматы)`,
    `🆔 <b>Lead ID:</b> <code>${escapeHtml(savedLead.id)}</code>`,
  ].filter(Boolean).join("\n");

  let telegramResponse: Response;
  try {
    telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (error) {
    console.error("Telegram request failed", error);
    return c.json({
      ok: false,
      leadId: savedLead.id,
      error: "Заявка сохранена, но уведомление в Telegram не отправлено",
    }, 502);
  }

  const telegramJson = await telegramResponse.json().catch(() => null);
  if (!telegramResponse.ok || !telegramJson?.ok) {
    console.error("Telegram API error", telegramJson);
    return c.json({
      ok: false,
      leadId: savedLead.id,
      error: "Заявка сохранена, но уведомление в Telegram не отправлено",
    }, 502);
  }

  const telegramMessageId = telegramJson.result?.message_id ?? null;
  const { error: updateError } = await supabase
    .from("leads")
    .update({
      telegram_sent: true,
      telegram_message_id: telegramMessageId,
    })
    .eq("id", savedLead.id);

  if (updateError) {
    console.error("Lead telegram status update failed", updateError);
  }

  return c.json({
    ok: true,
    leadId: savedLead.id,
  });
});

Deno.serve(app.fetch);
