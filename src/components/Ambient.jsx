import { useEffect, useMemo, useRef, useState } from "react";
import "./Ambient.css";

const DEFAULT_COUNT = { embers: 18, stars: 7, haze: 5, filigree: 9 };

/**
 * The drifting layer behind a section's content.
 *
 * Four registers, all built from the same khatim geometry rather than
 * scattered petals: embers rising from candlelight, slowly turning stars,
 * broad drifts of warm haze, and small filigree marks that breathe.
 * Motion is paused whenever the section is off screen.
 */
export default function Ambient({ variant = "embers", count, seed = 1 }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Seeded so a re-render never reshuffles the layout mid-view.
  const bits = useMemo(() => {
    const n = count ?? DEFAULT_COUNT[variant] ?? 12;
    const cursor = { s: (seed * 9301 + 49297) % 233280 };
    const rnd = () => {
      cursor.s = (cursor.s * 9301 + 49297) % 233280;
      return cursor.s / 233280;
    };

    return Array.from({ length: n }, (_, i) => ({
      id: i,
      x: rnd() * 100,
      y: rnd() * 100,
      scale: 0.6 + rnd() * 1.3,
      delay: -rnd() * 22, // negative so they start mid-cycle, never in lockstep
      dur: 11 + rnd() * 14,
      driftX: (rnd() - 0.5) * 120,
      driftY: 40 + rnd() * 90,
      spin: (rnd() - 0.5) * 260,
      opacity: 0.35 + rnd() * 0.5,
    }));
  }, [variant, count, seed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), {
      rootMargin: "15% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (still) return null;

  return (
    <div
      ref={ref}
      className={`ambient ambient--${variant} ${live ? "is-live" : ""}`.trim()}
      aria-hidden="true"
    >
      {bits.map((b) => (
        <span
          key={b.id}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            "--s": b.scale,
            "--delay": `${b.delay}s`,
            "--dur": `${b.dur}s`,
            "--dx": `${b.driftX}px`,
            "--dy": `${b.driftY}px`,
            "--spin": `${b.spin}deg`,
            "--o": b.opacity,
          }}
        />
      ))}
    </div>
  );
}
