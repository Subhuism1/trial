import { useCallback, useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { Monogram } from "./Ornaments.jsx";
import "./ScratchReveal.css";

// Scratched fraction that auto-completes the card. The foil runs on under the
// frame's flowers, and that hidden margin can never be rubbed, so the reachable
// maximum is well short of 1.
const REVEAL_AT = 0.3;
const SAMPLE_EVERY = 6; // only measure every Nth move — getImageData is costly
const BRUSH = 44;

const PETAL_COLOURS = ["#8c6254", "#b98f76", "#ece1d2", "#8f917d", "#ae845e"];

/** Small self-contained petal burst. Avoids pulling in a confetti dependency. */
export function burstPetals(originX, originY) {
  const canvas = document.createElement("canvas");
  canvas.className = "scratch__burst";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const petals = Array.from({ length: 70 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 4 + Math.random() * 8;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
      vy: Math.sin(angle) * speed,
      rw: 5 + Math.random() * 7,
      rh: 3 + Math.random() * 5,
      spin: (Math.random() - 0.5) * 0.25,
      rot: Math.random() * Math.PI,
      colour: PETAL_COLOURS[(Math.random() * PETAL_COLOURS.length) | 0],
      life: 0,
    };
  });

  let raf;
  const step = () => {
    ctx.clearRect(0, 0, w, h);
    let alive = false;

    for (const p of petals) {
      p.life += 1;
      p.vy += 0.16; // gravity
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;

      const fade = Math.max(0, 1 - p.life / 110);
      if (fade <= 0 || p.y > h + 40) continue;
      alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.colour;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rw, p.rh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (alive) {
      raf = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };
  step();
}

export default function ScratchReveal({ data, day, couple }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const scratching = useRef(false);
  const lastPoint = useRef(null);
  const moves = useRef(0);
  const scratched = useRef(false); // has the guest actually rubbed the foil?
  const painted = useRef(false); // has the foil actually been drawn on?
  const done = useRef(false);

  const [lifted, setLifted] = useState(false); // foil fading out
  const [revealed, setRevealed] = useState(false); // foil removed
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /** Paints the rose-gold foil that covers the card. */
  const paintFoil = useCallback((canvas) => {
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#e0ac5a");
    grad.addColorStop(0.35, "#f6dfa8");
    grad.addColorStop(0.6, "#e0a663");
    grad.addColorStop(1, "#f2cf8e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // diagonal sheen
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for (let i = -h; i < w; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // fine gold flecks, scattered — gives the foil a pressed-metal texture
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < Math.round((w * h) / 900); i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 0.4 + rand() * 0.9;
      ctx.globalAlpha = 0.25 + rand() * 0.35;
      ctx.fillStyle = rand() > 0.5 ? "#fff6e0" : "#a9773a";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(93, 76, 62, 0.62)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '600 13px "DM Sans", system-ui, sans-serif';
    ctx.letterSpacing = "3px";
    ctx.fillText("SCRATCH HERE", w / 2, h / 2 - 12);
    ctx.font = '400 26px "Cormorant Garamond", Georgia, serif';
    ctx.letterSpacing = "0px";
    ctx.fillText("✦", w / 2, h / 2 + 18);
    painted.current = true;
  }, []);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFoil(canvas);
  }, [paintFoil]);

  useEffect(() => {
    if (revealed) return;
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    if (cardRef.current) ro.observe(cardRef.current);
    window.addEventListener("resize", sizeCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [sizeCanvas, revealed]);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLifted(true);

    const card = cardRef.current;
    if (card && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = card.getBoundingClientRect();
      // Keep the origin on screen — petals born outside the viewport are culled
      // on the first frame and the burst would never be seen.
      const x = Math.min(Math.max(r.left + r.width / 2, 20), window.innerWidth - 20);
      const y = Math.min(Math.max(r.top + r.height / 2, 20), window.innerHeight - 20);
      burstPetals(x, y);
    }
    setTimeout(() => setRevealed(true), 700);
  }, []);

  /** Fraction of the foil already scratched away. */
  const scratchedRatio = useCallback(() => {
    const canvas = canvasRef.current;
    // An unpainted canvas is fully transparent, which would otherwise read as
    // 100% scratched and reveal the card the moment anything touches it.
    if (!canvas || !painted.current) return 0;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    if (!width || !height) return 0;

    const data = ctx.getImageData(0, 0, width, height).data;
    let clear = 0;
    let total = 0;
    const step = 8;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (data[(y * width + x) * 4 + 3] < 40) clear += 1;
        total += 1;
      }
    }
    return total ? clear / total : 0;
  }, []);

  const scratchAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = BRUSH;

    ctx.beginPath();
    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y + 0.1);
    }
    ctx.stroke();
    lastPoint.current = { x, y };
    scratched.current = true;
  }, []);

  const onDown = (e) => {
    if (done.current) return;
    scratching.current = true;
    // Capture keeps the stroke alive if the finger slides off the card. It
    // throws on an unknown pointer id, which must not break the scratch.
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      /* non-fatal */
    }
    scratchAt(e.clientX, e.clientY);
  };

  const onMove = (e) => {
    if (!scratching.current || done.current) return;
    scratchAt(e.clientX, e.clientY);
    if (++moves.current % SAMPLE_EVERY === 0 && scratchedRatio() >= REVEAL_AT) finish();
  };

  const onUp = () => {
    scratching.current = false;
    lastPoint.current = null;
    // Only judge the foil once it has actually been rubbed — pointerleave fires
    // on a plain scroll-past too, and must never reveal the card by itself.
    if (!done.current && scratched.current && scratchedRatio() >= REVEAL_AT) finish();
  };

  return (
    <section id="surprise" className="sec sec--geo scratch">
      <Ambient variant="filigree" seed={3} />
      <div className="wrap">
        <SectionTitle eyebrow="A Little Surprise" title={data.title} />

        <FadeIn className="scratch__frame">
          <img
            className="scratch__overlay"
            src="/templates/khatim/scratch-frame.webp"
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <div className="scratch__stage" ref={cardRef}>
            {/* the opening is narrow up here behind the swag — too narrow for a
                line of type, but right for the monogram */}
            <Monogram initials={couple.initials} className="scratch__monogram" />

            <div className="scratch__under">
              <p className="scratch__eyebrow">Save the date</p>
              <p className="scratch__date">{day.date}</p>
              <p className="scratch__when">
                {day.weekday} &middot; {day.nikahTime}
              </p>
              <p className="script scratch__line">{data.reveal}</p>
            </div>

            {!revealed && (
              <canvas
                ref={canvasRef}
                className={`scratch__foil ${lifted ? "is-lifted" : ""}`.trim()}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                onPointerLeave={onUp}
              />
            )}
          </div>
        </FadeIn>

        {!revealed && (
          <FadeIn as="p" className="scratch__hint" delay={0.1}>
            {reduced ? "Tap the button to reveal." : data.hint}
          </FadeIn>
        )}

        {/* Keyboard and reduced-motion path — scratching needs a pointer. */}
        {!revealed && (
          <div className="scratch__fallback">
            <button type="button" className="btn btn--line" onClick={finish}>
              Reveal it for me
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
