export type UrgencyTier = "emergency" | "urgent" | "general";

export interface GeoLocation {
  country?: string;
  state?: string;
  district?: string;
}

export interface ChatRequestBody {
  query: string;
  dropdown_country: string | null;
  geo_location: GeoLocation | null;
}

export interface ExtractedIntent {
  category: string;
  urgency_tier: string;
  state?: string | null;
  district?: string | null;
  country: string;
  warning?: string | null;
}

export interface ResourceItem {
  id?: string | number;
  name?: string;
  title?: string;
  organization?: string;
  department?: string;
  description?: string;
  service?: string;
  category?: string;
  
  // Contact numbers
  phone?: string;
  priority?: string | number;
  voice_numbers?: string[];
  
  // Verification
  verification_status?: "verified_web" | "verified_authority" | string;
  is_india_db?: boolean;
  
  // Details
  state?: string;
  district?: string;
  country?: string;
  languages?: string[] | string | null ;
  website?: string;
  url?: string;
  type?: string;
  availability?: string; // e.g., "24/7"

  whatsapp?: string | null;
  available_24x7?: boolean | null;
  verified_by?: string | null;
  
}

export interface ChatResponseBody {
  extracted: ExtractedIntent;
  resources: ResourceItem[];
  reply: string;
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  extracted?: ExtractedIntent;
  resources?: ResourceItem[];
  isTyping?: boolean;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}
