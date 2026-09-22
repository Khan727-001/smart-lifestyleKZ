declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim();

export function initGA4() {
  if (!GA4_ID || typeof window === "undefined") return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (..._args: unknown[]) {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);
}

export function trackLeadConversion(params: {
  leadId?: string;
  source?: string;
}) {
  if (!GA4_ID || typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "generate_lead", {
    lead_id: params.leadId,
    lead_source: params.source ?? "website",
    transport_type: "beacon",
  });
}
