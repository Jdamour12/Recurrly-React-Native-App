import { icons } from "@/constants/icons";
import type { ImageSourcePropType } from "react-native";

/**
 * Known brand name → local icon asset mapping.
 * Matches are case-insensitive and trimmed.
 */
const KNOWN_BRANDS: Record<string, ImageSourcePropType> = {
  spotify:   icons.spotify,
  netflix:   icons.notion,   // closest available
  notion:    icons.notion,
  figma:     icons.figma,
  adobe:     icons.adobe,
  "adobe creative cloud": icons.adobe,
  github:    icons.github,
  "github pro": icons.github,
  claude:    icons.claude,
  "claude pro": icons.claude,
  canva:     icons.canva,
  "canva pro": icons.canva,
  dropbox:   icons.dropbox,
  medium:    icons.medium,
  openai:    icons.openai,
  chatgpt:   icons.openai,
  "chatgpt plus": icons.openai,
};

/**
 * Guess the domain from a subscription name.
 * "Adobe Creative Cloud" → "adobe.com"
 * "GitHub Pro" → "github.com"
 */
function guessDomain(name: string): string {
  const stripped = name
    .toLowerCase()
    .trim()
    // Remove common suffixes
    .replace(/\s*(pro|plus|premium|basic|free|teams?|plan|starter|enterprise)\s*$/i, "")
    .trim()
    // Remove spaces for multi-word names
    .replace(/\s+/g, "");
  return `${stripped}.com`;
}

/**
 * Get the best icon for a subscription by name.
 *
 * 1. Check known local brands first (instant, offline)
 * 2. Fall back to CompanyEnrich logo API (remote URL)
 *
 * The returned value is always a valid ImageSourcePropType.
 */
export function getSubscriptionIcon(name: string): ImageSourcePropType {
  const key = name.toLowerCase().trim();

  // Check exact match first, then first-word match
  if (KNOWN_BRANDS[key]) {
    return KNOWN_BRANDS[key];
  }

  const firstWord = key.split(/\s+/)[0];
  if (KNOWN_BRANDS[firstWord]) {
    return KNOWN_BRANDS[firstWord];
  }

  // Use CompanyEnrich Logo API — free, no auth, no signup
  const domain = guessDomain(name);
  return { uri: `https://companyenrich.com/api/logos/${domain}` };
}

/** Fallback icon when a remote logo fails to load */
export const FALLBACK_ICON: ImageSourcePropType = icons.wallet;
