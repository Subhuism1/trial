import { useMemo } from "react";
import { useWeddingData } from "./lib/wedding-data-context.jsx";
import { resolveHostEntries } from "./lib/hosts.js";

// This template was originally a standalone Vite prototype
// whose components all read one nested `wedding` object out
// of a static data.js. Rather than rewrite every component's internal field
// names, this adapter reshapes the canonical WeddingData into that exact
// legacy shape once -- the same approach reshm-e-noor/emerald-qasr/zaytoon
// already take (see their own legacy-wedding-data.js). Components only ever
// changed their *source*. The prototype's own data.js shape is field-for-
// field identical to the rest of the Muslim/Nikah family, so this adapter
// mirrors zaytoon's closely.

const ASSETS = "/templates/khatim";

// Presentational transliteration for the ceremonies this template is built
// around -- NOT couple-entered content, so it lives here rather than in
// WeddingData (there is no field for it, and asking a couple to type Arabic
// script for a label would be a worse experience than matching on the name
// they already typed). An unrecognised event simply renders without the
// Arabic line; nothing is invented for it.
const EVENT_ARABIC = {
  mangni: "منگنی",
  nikah: "نِكَاح",
  nikaah: "نِكَاح",
  walima: "وَلِيمَة",
  waleema: "وَلِيمَة",
  mehendi: "مہندی",
  mehndi: "مہندی",
  henna: "مہندی",
  dholki: "ڈھولکی",
  haldi: "ہلدی",
  reception: "استقبال",
  sangeet: "سنگیت",
  barat: "بارات",
  baraat: "بارات",
};

// Same idea for the card icon: the editor's own icon field is a free-text
// emoji on every other family, so match this template's four drawn motifs
// (see EVENT_ICONS in Ornaments.jsx) off the event name and fall back to the
// rings.
const EVENT_ICON = {
  mangni: "rings",
  nikah: "moon",
  nikaah: "moon",
  walima: "lantern",
  waleema: "lantern",
  reception: "lantern",
  mehendi: "leaf",
  mehndi: "leaf",
  henna: "leaf",
  haldi: "leaf",
  sangeet: "lantern",
  barat: "lantern",
  baraat: "lantern",
};

// "12 March 2027" -> "Friday". Parsed by hand: Date() parsing of free-form
// strings differs between browsers (Safari in particular).
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function weekdayOf(dateText) {
  const m = /(\d{1,2})\s+([a-z]+)\s+(\d{4})/i.exec(dateText ?? "");
  if (!m) return "";
  const month = MONTHS.findIndex((name) => name.startsWith(m[2].toLowerCase().slice(0, 3)));
  if (month < 0) return "";
  const d = new Date(Number(m[3]), month, Number(m[1]));
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function normalise(name) {
  return (name ?? "").trim().toLowerCase().split(/[\s·—-]+/)[0];
}

function initialsOf(groom, bride) {
  return [groom?.trim()?.[0]?.toUpperCase() ?? "A", bride?.trim()?.[0]?.toUpperCase() ?? "B"];
}

export function useLegacyWeddingData() {
  const data = useWeddingData();

  return useMemo(() => {
    const groom = data.couple.groomName;
    const bride = data.couple.brideName;
    // Defaults to "groom-first" (not the type's documented "bride-first")
    // to match what every site already published on this template looked
    // like before this field existed -- see grand-celebration's identical
    // comment for the full reasoning.
    const nameOrder = data.couple.nameOrder ?? "groom-first";
    // Display-order pair for the fixed "X & Y" strings below -- groom/bride
    // themselves stay unswapped (see couple-name-order.ts for why swapping
    // the values broke hashtag/initials before).
    const [first, second] = nameOrder === "groom-first" ? [groom, bride] : [bride, groom];
    const when = new Date(data.weddingDateTime);
    const dateLong = when.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    const gallery = data.gallery ?? [];

    return {
      photos: {
        // No clip ships with this template (see hero.video/poster below) --
        // heroPoster is the whole backdrop, a still of the courtyard the
        // intro gate also uses.
        heroVideo: undefined,
        heroPoster: `${ASSETS}/hero-poster.jpg`,
        // The couple's own photos lead the full-width bands and the venue
        // card when they have any; the bundled art is only the fallback, so
        // an untouched site still looks finished instead of showing empty
        // strips. `||`, not `??`, on purpose: the editor's "Clear image"
        // button sets url to "" (not null/undefined), and `??` only falls
        // back on null/undefined -- see zaytoon/legacy-wedding-data.js's
        // identical comment.
        venueCard: gallery[2]?.url || `${ASSETS}/venue.jpg`,
        bandOne: {
          src: gallery[0]?.url || `${ASSETS}/band-one.jpg`,
          quote: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا",
          sub: gallery[0]?.caption || "May Allah bless you both",
        },
        bandTwo: {
          src: gallery[1]?.url || `${ASSETS}/venue.jpg`,
          quote: "",
          sub: gallery[1]?.caption || `${first} & ${second} · ${dateLong}`,
        },
      },

      couple: {
        groom,
        bride,
        // Display-order only -- never swap groom/bride *values* here (see
        // couple-name-order.ts for why that broke hashtag/initials before).
        nameOrder,
        groomFull: groom,
        brideFull: bride,
        hashtag: data.couple.hashtag ?? `#${groom}Weds${bride}`,
        initials: initialsOf(first, second),
      },

      day: {
        weekday: when.toLocaleDateString("en-US", { weekday: "long" }),
        date: dateLong,
        dateShort: `${when.getDate()} · ${when.getMonth() + 1} · ${when.getFullYear()}`,
        nikahTime: data.ceremonyStart ?? when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        city: data.venue.city ?? "",
        iso: data.weddingDateTime,
        // Names the ceremony in the countdown's closing line ("Until our
        // <this> on <date>"). "Nikah" was hardcoded in Countdown.jsx before
        // this field existed, so it stays the fallback -- a site that never
        // sets it renders exactly as it did.
        countdownLabel: data.countdownLabel ?? "Nikah",
      },

      // The intro gate (rope pull -> courtyard lights up -> tap the crescent)
      // and the hero that follows are this template's own bundled set piece,
      // not couple content -- which is why there is no hero-background
      // picker entry for this template (see NO_HERO_BACKGROUND_TEMPLATE_KEYS
      // in editor-shell.tsx): swapping in an arbitrary photo would break the
      // gate the hero is built on.
      opener: {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Most Gracious, the Most Merciful",
      },

      hero: {
        eyebrow: "Together with their families",
        intro: "We invite you to celebrate our",
        occasion: data.heroOccasion ?? "Nikah & Walima",
      },

      verse: {
        arabic:
          "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوٓا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
        translation:
          "And among His signs is that He created for you spouses from among yourselves, that you may find tranquility in them; and He placed between you affection and mercy.",
        reference: "Surah Ar-Rum · 30:21",
      },

      invite: {
        greeting:
          [data.story?.greetingLine1, data.story?.greetingLine2].filter(Boolean).join(" ") || "Dear Family & Friends",
        message: data.story?.message ?? "",
        signature: `With love, ${first} & ${second}`,
      },

      events: data.events.map((e) => {
        const key = normalise(e.name);
        return {
          id: e.id,
          photo: e.photo ?? "",
          name: e.name,
          arabic: EVENT_ARABIC[key] ?? "",
          subtitle: e.detail ?? "",
          date: e.date,
          time: e.time ?? "",
          place: e.location ?? "",
          // No link given -> a Google Maps search for the location itself.
          mapUrl:
            e.mapsUrl ||
            (e.location
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.location)}`
              : ""),
          weekday: weekdayOf(e.date),
          icon: EVENT_ICON[key] ?? "rings",
        };
      }),

      venue: {
        name: data.venue.name,
        address: data.venue.address,
        mapsUrl: data.venue.mapsUrl ?? "",
        note: data.venue.note ?? "",
      },

      // A separate ceremony/reception venue, or any other extra stop --
      // each editor-added entry gets its own optional photo too, at
      // gallery[3], gallery[4], ... (see the "Venue photo" picker inside
      // each extra venue's own block in editor-shell.tsx).
      additionalVenues: (data.additionalVenues ?? []).map((v, i) => ({
        name: v.name,
        address: v.address,
        mapsUrl: v.mapsUrl ?? "",
        note: v.note ?? "",
        photo: gallery[3 + i]?.url || "",
      })),

      dressCode: {
        title: data.dressCode?.title || "Festive Formal",
        text:
          data.dressCode?.text ||
          "Traditional or formal attire is encouraged. Sherwanis, kurtas, sarees, lehengas, anarkalis, and formal suits are all welcome. We kindly ask guests to avoid overly casual attire and white or ivory.",
        him: data.dressCode?.him ?? [],
        her: data.dressCode?.her ?? [],
        palette: data.dressCode?.palette ?? [],
        avoid: data.dressCode?.avoid ?? [],
      },

      scratch: {
        title: "Scratch & Reveal",
        hint: "Rub the foil with your finger or cursor",
        reveal: "We cannot wait to see you there",
      },

      rsvp: {
        enabled: data.rsvp?.enabled ?? true,
        deadline: data.rsvp?.deadline ?? data.rsvpDeadline ?? "",
        message:
          data.rsvp?.customMessage ?? "We have saved you a seat — kindly let us know if you can join us.",
        guestOptions: ["1", "2", "3", "4", "5+"],
        fields: data.rsvp?.fields,
      },

      blessings: {
        intro:
          "Your presence and your duas are the greatest gift we could ask for. If you would still like to send something, a small note is all we ask.",
        // GIFT_ICONS only has two motifs, so alternate rather than repeat one
        // when a couple adds a third card.
        items: (data.gifts ?? []).map((g, i) => ({
          title: g.title,
          text: g.text,
          icon: i % 2 === 0 ? "heart" : "hands",
        })),
      },

      // The groom's and bride's sides plus any extra host blocks the couple
      // added, in render order -- a list rather than the fixed
      // `{ groomSide, brideSide }` pair, so Contact.jsx renders however many
      // there are instead of exactly two.
      contact: resolveHostEntries(data.hosts, data.couple).map((side) => ({
        key: side.key,
        label: side.relation,
        person: side.person,
        parents: side.subtitle ?? "",
        phones: side.phones,
      })),

      footer: {
        message: data.footer?.message ?? "",
        duaArabic: "آمِين",
        dua: "Ameen",
        dateLine: [dateLong, data.venue.name, data.venue.city].filter(Boolean).join(" · "),
      },
    };
  }, [data]);
}
