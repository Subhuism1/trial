/* Geometric ornament set — khatim stars, jali frets and mehrab arches,
   drawn as thin engraved rules rather than botanical line art. */

/** The eight-point khatim star. The motif everything else is built from. */
export function Star({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 2.5 24.6 12l10.4 1.5-7.5 7.3 1.8 10.4L20 26.3l-9.3 4.9 1.8-10.4L5 13.5 15.4 12z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M20 8.5 22.9 15l7 1-5 4.9 1.2 7-6.1-3.3-6.1 3.3 1.2-7-5-4.9 7-1z"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Section rule: a hairline that draws outward from a centred star. */
export function Divider({ className }) {
  return (
    <svg viewBox="0 0 240 24" fill="none" className={className} aria-hidden="true">
      <line x1="0" y1="12" x2="96" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <line x1="144" y1="12" x2="240" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <line x1="86" y1="12" x2="104" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3" />

      <g className="rule-star" style={{ transformOrigin: "120px 12px" }}>
        <path
          d="M120 2.5 123 9l6.8 1-4.9 4.6 1.2 6.6-6.1-3.2-6.1 3.2 1.2-6.6L110.2 10l6.8-1z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** A right-angle fret, set into a panel corner. */
export function CornerFret({ className }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
      <path d="M2 26V2h24" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 30V9h21" stroke="currentColor" strokeWidth="1" opacity="0.65" />
      <path d="M16 20v-4h4" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M30 4.5 31.9 9l4.6.7-3.3 3.2.8 4.6-4-2.2-4.1 2.2.8-4.6L23.4 9.7 28 9z"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The four event marks are drawn on a 48-unit grid with heavier strokes than
   the ornaments: they render at around 40px, where fine detail turns to mud. */

/** Two bound rings — the engagement. */
export function Rings({ className }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="18" cy="29" r="13" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="30" cy="29" r="13" stroke="currentColor" strokeWidth="1.8" />
      <path d="M24 4.5 28 10l-4 5.5L20 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** A buta — the paisley of henna work. */
export function Leaf({ className }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M23 44C13.6 44 8 37.7 8 29.2 8 17 16.4 6.6 27.5 4c-3.4 6.2-4 11.4.8 15.4C33.6 23.7 38 26.3 38 32.6 38 39.3 32.4 44 23 44z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M23 36.5c-4.4 0-7.2-3-7.2-7.2 0-5.6 3.9-11 8.8-13"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.65"
      />
    </svg>
  );
}

/** Crescent and star — the nikah. The arc flags matter: the obvious pair sends
    the outer sweep off the left of the box, where the frame crops it. */
export function Crescent({ className }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M29.2 11.1a15 15 0 1 0 0 25.8a13 13 0 1 1 0-25.8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M34.5 17 36.26 21.57 41.16 21.84 37.35 24.93 38.61 29.66 34.5 27 30.39 29.66 31.65 24.93 27.84 21.84 32.74 21.57z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A hanging lantern — the walima. */
export function Lantern({ className }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 3v4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 10.5h18L28.5 17h-9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M19.5 17h9l3 16.5-7.5 6.5-7.5-6.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M24 22.5 27 27l-3 4.5-3-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
      <path d="M19 41.5h10l-1.5 4.5h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Two hands raised in dua, reduced to arcs. */
export function Hands({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M20 34c-6-4-9-9-9-15V8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M20 34c6-4 9-9 9-15V8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M15.5 12V6M24.5 12V6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M20 34v4" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M20 16.5 21.6 20.5 25.7 21l-3 2.9.7 4.1-3.4-2-3.4 2 .7-4.1-3-2.9 4.1-.5z"
        stroke="currentColor"
        strokeWidth="0.85"
        opacity="0.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A gift medallion — nested diamonds bound by a rule. */
export function Heart({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M20 5 35 20 20 35 5 20z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M20 11.5 28.5 20 20 28.5 11.5 20z" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M20 17 23 20l-3 3-3-3z" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
      <path d="M5 20h30M20 5v30" stroke="currentColor" strokeWidth="0.7" opacity="0.28" />
    </svg>
  );
}

/** The dress-code mark: a folded panel inside an arch. */
export function Attire({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M7 35V17c0-6.6 5.4-12 13-12s13 5.4 13 12v18z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M20 5v30" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <path d="M13.5 35V19.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5V35" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M20 21.5 22.4 24 20 26.5 17.6 24z" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
    </svg>
  );
}

/** The couple's initials set either side of a khatim star, ruled off to both
    sides — the letters flank the star rather than sitting across its points. */
export function Monogram({ initials = ["A", "B"], className }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" className={className} aria-hidden="true">
      <line x1="8" y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="148" y1="30" x2="192" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.45" />

      <path
        d="M100 17 102.37 24.27 109.19 20.81 105.73 27.63 113 30 105.73 32.37 109.19 39.19 102.37 35.73 100 43 97.63 35.73 90.81 39.19 94.27 32.37 87 30 94.27 27.63 90.81 20.81 97.63 24.27z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
        strokeLinejoin="round"
      />

      <text
        x="72"
        y="37.5"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="22"
        fill="currentColor"
      >
        {initials[0]}
      </text>
      <text
        x="128"
        y="37.5"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="22"
        fill="currentColor"
      >
        {initials[1]}
      </text>
    </svg>
  );
}

export const EVENT_ICONS = { rings: Rings, leaf: Leaf, moon: Crescent, lantern: Lantern };
export const GIFT_ICONS = { heart: Heart, hands: Hands };
