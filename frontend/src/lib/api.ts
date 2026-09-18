import { ChatRequestBody, ChatResponseBody, GeoLocation } from "@/types";

const DJANGO_API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/chat/`
    : "http://127.0.0.1:8000/api/chat/";

export async function fetchChatResponse(
  query: string,
  country: string | null = "India",
  geoLocation: GeoLocation | null = null
): Promise<{ data: ChatResponseBody; error: string | null }> {
  const payload: ChatRequestBody = {
    query,
    dropdown_country: country,
    geo_location: geoLocation,
  };

  try {
    const controller = new AbortController();
    //const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(DJANGO_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    //clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Django API returned status ${res.status}`);

    const data: ChatResponseBody = await res.json();
    return { data, error: null };
  } catch (err) {
    console.error(`[TrustLine] Backend unreachable at ${DJANGO_API_ENDPOINT}:`, err);
    return {
      data: {
        extracted: { category: "unknown", urgency_tier: "general", state: null, district: null, country: country || "India", warning: null },
        reply: "We couldn't reach the server right now. Please try again in a moment.",
        resources: [],
      },
      error: "backend_unreachable",
    };
  }
}