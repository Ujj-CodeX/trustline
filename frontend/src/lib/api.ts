import { ChatRequestBody, ChatResponseBody, GeoLocation, ResourceItem } from "@/src/types";

const DJANGO_API_ENDPOINT = "http://127.0.0.1:8000/api/chat/";

export async function fetchChatResponse(
  query: string,
  country: string | null = "India",
  geoLocation: GeoLocation | null = null
): Promise<{ data: ChatResponseBody; isFallback: boolean }> {
  const payload: ChatRequestBody = {
    query,
    dropdown_country: country,
    geo_location: geoLocation,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(DJANGO_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Django API returned status ${res.status}`);
    }

    const data: ChatResponseBody = await res.json();
    return { data, isFallback: false };
  } catch (error) {
    console.warn(
      `[TrustLine] Could not reach Django backend at ${DJANGO_API_ENDPOINT}:`,
      error
    );

    // Provide realistic intelligent response matching the DRF schema
    // so the frontend is fully demonstrable even if Django is not active yet in the preview.
    const fallbackData = generateFallbackResponse(query, country);
    return { data: fallbackData, isFallback: true };
  }
}

function generateFallbackResponse(query: string, country: string | null): ChatResponseBody {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("cyber") || lowerQuery.includes("fraud") || lowerQuery.includes("scam") || lowerQuery.includes("money") || lowerQuery.includes("hacked")) {
    return {
      extracted: {
        category: "Cyber Crime",
        urgency_tier: "urgent",
        state: "Uttar Pradesh",
        district: "Lucknow",
        country: country || "India",
        warning: null,
      },
      reply:
        "I'm sorry to hear about this. Cyber fraud can be very stressful, but help is available. Here are some verified helplines and cyber crime reporting resources that you can reach out to immediately.",
      resources: [
        {
          id: 1,
          name: "Uttar Pradesh Cyber Crime Helpline",
          title: "Uttar Pradesh Cyber Crime Helpline",
          organization: "Uttar Pradesh Police",
          department: "Cyber Crime Cell",
          description: "Report financial cyber fraud, online scams, identity theft, and unauthorized bank transactions.",
          phone: "1930",
          priority: 1,
          state: "Uttar Pradesh",
          district: "Lucknow",
          country: "India",
          languages: ["Hindi", "English"],
          type: "Official Government Helpline",
          availability: "24/7",
          is_india_db: true,
        },
        {
          id: 2,
          name: "National Cyber Crime Reporting Portal",
          title: "National Cyber Crime Reporting Portal",
          organization: "Ministry of Home Affairs, Government of India",
          description: "Report cyber crimes online with real-time complaint registration and bank freezing support.",
          phone: "1930",
          priority: 2,
          website: "https://www.cybercrime.gov.in",
          url: "https://www.cybercrime.gov.in",
          state: "All States",
          country: "India",
          languages: ["Hindi", "English", "Regional"],
          type: "Central Government Portal",
          is_india_db: true,
        },
        {
          id: 3,
          name: "CERT-In Incident Response Help Desk",
          title: "CERT-In Incident Response Help Desk",
          organization: "Ministry of Electronics and Information Technology",
          description: "National nodal agency for responding to computer security incidents.",
          phone: "1800-11-4949",
          priority: 3,
          state: "National",
          country: "India",
          type: "Advisory & Response Cell",
          is_india_db: true,
        }
      ],
    };
  }

  if (lowerQuery.includes("suicide") || lowerQuery.includes("depress") || lowerQuery.includes("mental") || lowerQuery.includes("anxious") || lowerQuery.includes("stress")) {
    return {
      extracted: {
        category: "Mental Health Support",
        urgency_tier: "emergency",
        country: country || "India",
        warning: "If you or someone you know is in immediate life-threatening danger, please dial your local emergency services right away.",
      },
      reply:
        "You are not alone, and compassionate confidential support is available right now. Please connect with the trained professionals below who can listen and support you through this.",
      resources: [
        {
          id: 10,
          name: "Tele-MANAS (Tele Mental Health National Support)",
          title: "Tele-MANAS",
          organization: "Ministry of Health and Family Welfare",
          description: "24/7, free, comprehensive mental health counseling and psychological support services across 20+ languages.",
          phone: "14416",
          voice_numbers: ["14416", "1800-891-4416"],
          priority: 1,
          country: "India",
          languages: ["Hindi", "English", "Regional"],
          type: "National Mental Health Helpline",
          availability: "24/7",
          is_india_db: true,
        },
        {
          id: 11,
          name: "KIRAN Mental Health Rehabilitation",
          title: "KIRAN Helpline",
          organization: "Department of Empowerment of Persons with Disabilities",
          description: "Early screening, first aid, psychological support, distress management, and mental wellbeing.",
          phone: "1800-599-0019",
          priority: 2,
          country: "India",
          languages: ["13 Languages"],
          type: "National Helpline",
          availability: "24/7",
          is_india_db: true,
        }
      ],
    };
  }

  if (lowerQuery.includes("women") || lowerQuery.includes("harass") || lowerQuery.includes("domestic") || lowerQuery.includes("violence") || lowerQuery.includes("abuse")) {
    return {
      extracted: {
        category: "Women Safety & Gender Support",
        urgency_tier: "emergency",
        country: country || "India",
        warning: "Your safety is the highest priority. If you are in urgent physical danger, call 112 immediately.",
      },
      reply:
        "Here are dedicated, confidential helplines for women in distress, offering emergency response, legal counsel, and shelter support.",
      resources: [
        {
          id: 20,
          name: "Women Helpline (All India)",
          title: "Women in Distress Helpline",
          organization: "National Commission for Women (NCW)",
          description: "Emergency response and round-the-clock referral for women facing violence or harassment.",
          phone: "1091",
          voice_numbers: ["1091", "7827170170"],
          priority: 1,
          country: "India",
          languages: ["Hindi", "English", "Regional"],
          type: "Official Women Emergency Helpline",
          availability: "24/7",
          is_india_db: true,
        },
        {
          id: 21,
          name: "National Emergency Response Support System (ERSS)",
          title: "National Emergency Number",
          organization: "Government of India",
          description: "Integrated single emergency number for Police, Fire, and Medical assistance.",
          phone: "112",
          priority: 1,
          country: "India",
          availability: "24/7",
          type: "Unified Emergency Response",
          is_india_db: true,
        }
      ],
    };
  }

  // Default support
  return {
    extracted: {
      category: "General Support & Assistance",
      urgency_tier: "general",
      country: country || "India",
      warning: null,
    },
    reply:
      `Here are the verified helpline resources for ${country || "your location"}. You can contact these certified authorities directly for immediate support.`,
    resources: [
      {
        id: 30,
        name: "National Emergency Number",
        title: "National Emergency Service (ERSS)",
        organization: "Public Safety & Emergency Department",
        description: "Direct emergency dispatch for police, ambulance, and fire rescue services.",
        phone: "112",
        priority: 1,
        country: country || "India",
        languages: ["English", "National Languages"],
        type: "National Emergency Hotline",
        availability: "24/7",
        verification_status: "verified_authority",
      },
      {
        id: 31,
        name: "Citizen Assistance & Information Center",
        title: "Citizen Public Support Helpline",
        organization: "Government Public Services",
        description: "Guidance on legal aid, healthcare services, consumer protection, and welfare programs.",
        phone: "1070",
        voice_numbers: ["1070"],
        priority: 2,
        country: country || "India",
        type: "Public Services Helpline",
        verification_status: "verified_web",
      }
    ],
  };
}
