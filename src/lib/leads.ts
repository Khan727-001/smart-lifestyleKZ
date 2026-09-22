import { publicAnonKey, projectId } from "../../utils/supabase/info";

export type LeadPayload = {
  requestId: string;
  name: string;
  phone: string;
  message?: string;
  source?: string;
  pageUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  website?: string; // honeypot: must stay empty
};

export type LeadResponse = {
  ok: boolean;
  leadId?: string;
  error?: string;
};

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
  || `https://${projectId}.supabase.co`;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()
  || publicAnonKey;

export function getLeadAttribution(): Pick<
  LeadPayload,
  "source" | "pageUrl" | "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm" | "gclid"
> {
  if (typeof window === "undefined") return { source: "website" };

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || "website",
    pageUrl: window.location.href,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmContent: params.get("utm_content") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    gclid: params.get("gclid") || undefined,
  };
}

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const url = `${supabaseUrl}/functions/v1/server/make-server-733add02/lead`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseAnonKey}`,
      "apikey": supabaseAnonKey,
    },
    body: JSON.stringify(payload),
  });

  let data: LeadResponse | null = null;
  try {
    data = await response.json();
  } catch {
    // handled below
  }

  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || "Не удалось отправить заявку");
  }

  return data;
}
