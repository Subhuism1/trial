// Personal invite links, readable and short -- the guest's details are the
// query string itself, so the site stays fully static (no database):
//
//   /?upadhyay-family-3     -> "Upadhyay Family", 3 guests, groom's side
//   /?rafiq-ahmed-and-family-5b -> "Rafiq Ahmed & Family", 5 guests, bride's side
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

export function guestSlug({ family, count, side }) {
  const n = Math.max(1, Math.min(99, Number(count) || 1));
  return `${slugify(family)}-${n}${side === "bride" ? "b" : ""}`;
}

export function parseGuestSlug(slug) {
  const m = /^(.+?)-(\d{1,2})(b|g)?$/i.exec(slug.trim());
  if (!m) return null;
  const family = unslugify(m[1]).slice(0, 80);
  if (!family) return null;
  return {
    family,
    count: Math.max(1, parseInt(m[2], 10)),
    members: [],
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
    const members = Array.isArray(p.m)
      ? p.m.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim().slice(0, 40)).slice(0, 30)
      : [];
    const count = Math.max(1, Math.min(99, parseInt(p.c, 10) || members.length || 1));
    const side = p.s === "groom" || p.s === "bride" ? p.s : null;
    return { family, count, members, side };
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
