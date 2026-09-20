import { useCallback, useEffect, useRef, useState } from "react";
import { burstPetals } from "./ScratchReveal.jsx";

// A gold scratch-off foil laid over whatever its parent holds. The parent must
// be `position: relative`; the foil measures its own box (place it with CSS
// insets), so it can sit flush or inside a frame.
//
// Smoothness notes:
//  - soft, feathered brush stamped at tight spacing along the stroke, so fast
//    swipes leave a continuous trail instead of dotted blobs
//  - coalesced pointer events: every sample the hardware reported, not just
//    one per frame
//  - coverage is tracked on a small grid as we paint -- no getImageData()
//    read-back, which is what made the old foil stutter mid-scratch
const RADIUS = 24; // brush radius, CSS px
const SPACING = RADIUS * 0.3; // distance between stamps along a stroke
const GRID = 18; // coverage grid cells per side (18 x 18)
const REVEAL_AT = 0.34; // fraction of grid cells touched that completes the card

function makeBrush(radius, dpr) {
  const size = Math.ceil(radius * 2 * dpr);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.9)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

function paintFoil(ctx, w, h, label) {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#c9a15a");
  grad.addColorStop(0.3, "#f3dfa6");
  grad.addColorStop(0.55, "#d3aa62");
  grad.addColorStop(0.8, "#f0d493");
  grad.addColorStop(1, "#be9451");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // brushed-metal grain
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  for (let i = -h; i < w; i += 7) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
  }

  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < Math.round((w * h) / 700); i++) {
    ctx.globalAlpha = 0.18 + rand() * 0.3;
    ctx.fillStyle = rand() > 0.5 ? "#fff6e0" : "#8f672d";
    ctx.beginPath();
    ctx.arc(rand() * w, rand() * h, 0.4 + rand() * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(92, 66, 26, 0.32)";
  ctx.strokeRect(8.5, 8.5, w - 17, h - 17);

  ctx.fillStyle = "rgba(70, 50, 20, 0.72)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '500 12px "Jost", system-ui, sans-serif';
  if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
  ctx.fillText(label.toUpperCase(), w / 2, h / 2 - 14);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.font = '400 22px "Cinzel", Georgia, serif';
  ctx.fillText("✦", w / 2, h / 2 + 14);
}

export default function ScratchFoil({ onReveal, onStart, label = "Scratch to reveal", revealed = false }) {
  const canvasRef = useRef(null);
  const dustRef = useRef(null);
  const st = useRef({
    w: 0,
    h: 0,
    brush: null,
    grid: new Uint8Array(GRID * GRID),
    covered: 0,
    last: null,
    down: false,
    started: false,
    done: false,
    dust: [],
    raf: 0,
  });
  const [lifted, setLifted] = useState(false);
  const [gone, setGone] = useState(false);

  const size = useCallback(() => {
    const canvas = canvasRef.current;
    const s = st.current;
    if (!canvas || s.done || s.started) return; // never wipe a half-scratched foil
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    Object.assign(s, { w: width, h: height, brush: makeBrush(RADIUS, dpr) });
    for (const c of [canvas, dustRef.current]) {
      if (!c) continue;
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
      c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    paintFoil(canvas.getContext("2d"), width, height, label);
  }, [label]);

  useEffect(() => {
    size();
    const host = canvasRef.current?.parentElement;
    const ro = new ResizeObserver(size);
    if (host) ro.observe(host);
    document.fonts?.ready.then(size); // repaint the label once web fonts land
    const s = st.current;
    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.raf);
    };
  }, [size]);

  const finish = useCallback(
    (burst = true) => {
      const s = st.current;
      if (s.done) return;
      s.done = true;
      s.down = false;
      setLifted(true);
      const canvas = canvasRef.current;
      if (burst && canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const r = canvas.getBoundingClientRect();
        burstPetals(
          Math.min(Math.max(r.left + r.width / 2, 20), window.innerWidth - 20),
          Math.min(Math.max(r.top + r.height / 2, 20), window.innerHeight - 20)
        );
        try {
          navigator.vibrate?.(18);
        } catch {
          /* ignore */
        }
      }
      window.setTimeout(() => setGone(true), 900);
      onReveal?.();
    },
    [onReveal]
  );

  // "Reveal all" from outside
  useEffect(() => {
    if (revealed) finish(false);
  }, [revealed, finish]);

  // ── gold dust shaken loose by the scratch ──
  const tickDust = () => {
    const s = st.current;
    const ctx = dustRef.current?.getContext("2d");
    if (!ctx) {
      s.raf = 0;
      return;
    }
    ctx.clearRect(0, 0, s.w, s.h);
    s.dust = s.dust.filter((p) => p.life > 0);
    for (const p of s.dust) {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      ctx.globalAlpha = Math.min(1, p.life / 25);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    }
    ctx.globalAlpha = 1;
    s.raf = s.dust.length ? requestAnimationFrame(tickDust) : 0;
  };

  const shed = (x, y) => {
    const s = st.current;
    if (s.dust.length > 90 || Math.random() > 0.35) return;
    s.dust.push({
      x: x + (Math.random() - 0.5) * RADIUS,
      y: y + (Math.random() - 0.5) * RADIUS * 0.6,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -Math.random() * 0.8,
      r: 1 + Math.random() * 1.8,
      life: 30 + Math.random() * 25,
      c: Math.random() > 0.4 ? "#f3dfa6" : "#c9a15a",
    });
    if (!s.raf) s.raf = requestAnimationFrame(tickDust);
  };

  const stamp = (ctx, x, y) => {
    const s = st.current;
    ctx.drawImage(s.brush, x - RADIUS, y - RADIUS, RADIUS * 2, RADIUS * 2);

    // mark grid cells under the brush's solid core
    const cw = s.w / GRID;
    const ch = s.h / GRID;
    const r = RADIUS * 0.7;
    const x0 = Math.max(0, Math.floor((x - r) / cw));
    const x1 = Math.min(GRID - 1, Math.floor((x + r) / cw));
    const y0 = Math.max(0, Math.floor((y - r) / ch));
    const y1 = Math.min(GRID - 1, Math.floor((y + r) / ch));
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const cx = (gx + 0.5) * cw - x;
        const cy = (gy + 0.5) * ch - y;
        const i = gy * GRID + gx;
        if (!s.grid[i] && cx * cx + cy * cy <= r * r) {
          s.grid[i] = 1;
          s.covered += 1;
        }
      }
    }
    shed(x, y);
  };

  const strokeTo = (x, y) => {
    const s = st.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !s.brush) return;
    ctx.globalCompositeOperation = "destination-out";
    const from = s.last ?? { x, y };
    const dist = Math.hypot(x - from.x, y - from.y);
    const steps = Math.max(1, Math.ceil(dist / SPACING));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      stamp(ctx, from.x + (x - from.x) * t, from.y + (y - from.y) * t);
    }
    s.last = { x, y };
  };

  const local = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const progress = () => st.current.covered / (GRID * GRID);

  const onDown = (e) => {
    const s = st.current;
    if (s.done) return;
    s.down = true;
    s.last = null;
    if (!s.started) {
      s.started = true;
      onStart?.();
    }
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      /* non-fatal */
    }
    const p = local(e);
    strokeTo(p.x, p.y);
  };

  const onMove = (e) => {
    const s = st.current;
    if (!s.down || s.done) return;
    const samples = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const ev of samples.length ? samples : [e]) {
      const p = local(ev);
      strokeTo(p.x, p.y);
    }
    if (progress() >= REVEAL_AT) finish();
  };

  const onUp = () => {
    const s = st.current;
    s.down = false;
    s.last = null;
    if (!s.done && s.started && progress() >= REVEAL_AT) finish();
  };

  if (gone) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`foil ${lifted ? "is-lifted" : ""}`.trim()}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-hidden="true"
      />
      <canvas ref={dustRef} className="foil__dust" aria-hidden="true" />
      {/* keyboard path -- scratching needs a pointer */}
      {!lifted && (
        <button type="button" className="foil__key" onClick={() => finish()}>
          Reveal details
        </button>
      )}
    </>
  );
}
