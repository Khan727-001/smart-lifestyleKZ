declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __smartLifestyleClickTracking?: boolean;
    __smartLifestyleGA4Initialized?: boolean;
  }
}

const DEFAULT_GA4_ID = "G-KR48SRW021";

const GA4_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() ||
  DEFAULT_GA4_ID;

export function initGA4() {
  if (!GA4_ID || typeof window === "undefined") return;
  if (window.__smartLifestyleGA4Initialized) return;
  window.__smartLifestyleGA4Initialized = true;

  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function (..._args: unknown[]) {
      window.dataLayer.push(arguments);
    };
  }

  window.gtag("js", new Date());

  const configParams: Record<string, unknown> = {
    send_page_view: true,
  };

  if (import.meta.env.DEV) {
    configParams.debug_mode = true;
  }

  window.gtag("config", GA4_ID, configParams);

  const selector = `script[src*="googletagmanager.com/gtag/js?id=${GA4_ID}"]`;
  if (!document.querySelector(selector)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.appendChild(script);
  }

  if (import.meta.env.DEV) {
    sendEvent("analytics_test", {
      test_source: "vite_dev",
      page_path: window.location.pathname,
    });
  }
}

function sendEvent(name: string, params: Record<string, unknown>) {
  if (!GA4_ID || typeof window === "undefined" || !window.gtag) return;
  const eventParams: Record<string, unknown> = {
    ...params,
    transport_type: "beacon",
    send_to: GA4_ID,
  };

  if (import.meta.env.DEV) {
    eventParams.debug_mode = true;
  }

  if (import.meta.env.DEV) {
    console.info("[GA4]", name, eventParams);
  }

  window.gtag("event", name, eventParams);
}

function normalizeLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 100);
}

function getSection(element: HTMLElement) {
  const explicit = element.closest<HTMLElement>("[data-analytics-section]")?.dataset.analyticsSection;
  if (explicit) return explicit;

  const section = element.closest<HTMLElement>("section[id]");
  if (section?.id) return section.id;

  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest(".fixed")) return "floating_widget";

  return "page";
}

function classifyDestination(element: HTMLAnchorElement | HTMLButtonElement) {
  if (!(element instanceof HTMLAnchorElement)) {
    return { destination: "button", channel: undefined, target: undefined };
  }

  const href = element.getAttribute("href") || "";

  if (href.startsWith("tel:")) {
    return { destination: "contact", channel: "phone", target: "tel" };
  }

  if (/wa\.me|whatsapp\.com/i.test(href)) {
    return { destination: "contact", channel: "whatsapp", target: "whatsapp" };
  }

  if (/t\.me/i.test(href)) {
    return { destination: "contact", channel: "telegram", target: "telegram" };
  }

  if (href.startsWith("#")) {
    return { destination: "anchor", channel: undefined, target: href.slice(0, 100) };
  }

  try {
    const url = new URL(href, window.location.href);
    const sameOrigin = url.origin === window.location.origin;
    return {
      destination: sameOrigin ? "internal_link" : "external_link",
      channel: undefined,
      target: sameOrigin ? `${url.pathname}${url.hash}`.slice(0, 200) : url.hostname.slice(0, 120),
    };
  } catch {
    return { destination: "link", channel: undefined, target: undefined };
  }
}

export function initPublicClickTracking() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__smartLifestyleClickTracking) return;
  window.__smartLifestyleClickTracking = true;

  document.addEventListener("click", (event) => {
    if (window.location.pathname.startsWith("/admin")) return;

    const rawTarget = event.target;
    if (!(rawTarget instanceof Element)) return;

    const element = rawTarget.closest<HTMLAnchorElement | HTMLButtonElement>("a,button");
    if (!element || element.hasAttribute("disabled") || element.closest("[data-analytics-ignore]")) return;

    const text =
      element.dataset.analyticsLabel ||
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.textContent ||
      "";

    const label = normalizeLabel(text) || "Без подписи";
    const section = getSection(element);
    const { destination, channel, target } = classifyDestination(element);

    const params = {
      cta_name: label,
      cta_section: section,
      cta_element: element.tagName.toLowerCase(),
      cta_destination: destination,
      cta_target: target,
      page_path: window.location.pathname,
    };

    // Единое событие для каждого публичного клика по ссылке или кнопке.
    sendEvent("cta_click", params);

    // Дополнительные события для ключевых типов действий.
    if (/запис|оставить заявку|отправить заявку/i.test(label)) {
      sendEvent("booking_start", params);
    }

    if (channel) {
      sendEvent("contact_click", {
        ...params,
        contact_channel: channel,
      });
    }
  }, true);
}

export function trackLeadConversion(params: {
  leadId?: string;
  source?: string;
}) {
  sendEvent("generate_lead", {
    lead_id: params.leadId,
    lead_source: params.source ?? "website",
  });
}
