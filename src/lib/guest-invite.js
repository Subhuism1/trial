// Personal invite links, readable and short -- the guest's details are the
// query string itself, so the site stays fully static (no database):
//
//   /?upadhyay-family-3          -> "Upadhyay Family", 3 guests, groom's side
//   /?upadhyay-family-f          -> "Upadhyay Family", with family, groom's side
//   /?rafiq-ahmed-and-family-5b  -> "Rafiq Ahmed & Family", 5 guests, bride's side
//
// The word "and" becomes "&". Older `?to=<base64>` links still work.

const LEGACY_PARAM = "to";

// Keep letters/digits of any script; everything else becomes a hyphen.
function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function unslugify(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => (w === "and" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function guestSlug({ family, count, withFamily, side }) {
  const size = withFamily ? "f" : Math.max(1, Math.min(99, Number(count) || 1));
  return `${slugify(family)}-${size}${side === "bride" ? "b" : ""}`;
}

export function parseGuestSlug(slug) {
  const m = /^(.+?)-(\d{1,2}|f)(b|g)?$/i.exec(slug.trim());
  if (!m) return null;
  const family = unslugify(m[1]).slice(0, 80);
  if (!family) return null;
  const withFamily = m[2].toLowerCase() === "f";
  return {
    family,
    withFamily,
    count: withFamily ? null : Math.max(1, parseInt(m[2], 10)),
    side: m[3]?.toLowerCase() === "b" ? "bride" : "groom",
  };
}

function decodeLegacy(token) {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
    const p = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0))));
    const family = typeof p.f === "string" ? p.f.trim().slice(0, 80) : "";
    if (!family) return null;
    return {
      family,
      withFamily: false,
      count: Math.max(1, Math.min(99, parseInt(p.c, 10) || 1)),
      side: p.s === "groom" || p.s === "bride" ? p.s : "groom",
    };
  } catch {
    return null;
  }
}

export function readGuestFromUrl() {
  if (typeof window === "undefined") return null;
  const search = window.location.search.slice(1);
  if (!search) return null;

  const legacy = new URLSearchParams(search).get(LEGACY_PARAM);
  if (legacy) return decodeLegacy(legacy);

  // The slug is the first bare query item (ignore tracking params like &fbclid=...).
  const first = search.split("&")[0];
  if (first.includes("=")) return null;
  try {
    return parseGuestSlug(decodeURIComponent(first));
  } catch {
    return null;
  }
}

export function buildInviteUrl(baseUrl, guest) {
  const url = new URL(baseUrl);
  return `${url.origin}${url.pathname}?${guestSlug(guest)}`;
}
