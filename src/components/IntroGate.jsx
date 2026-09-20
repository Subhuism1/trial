import { useEffect, useRef, useState } from "react";
import "./IntroGate.css";

// Bundled public assets (not a Vite-style module import -- Next serves
// everything under public/ by its own path directly).
const courtyardScene = "/templates/khatim/intro-courtyard.jpg";
const ropeImgSrc = "/templates/khatim/intro-rope.webp";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * The very first screen. A rope hangs from the top of the frame — pull it
 * down and the courtyard lights up, the couple's names cascade in, and a
 * crescent moon appears to be tapped open before the guest is let through to
 * the hero section beneath.
 */
export default function IntroGate({ couple, day, venue, guest, onOpen, onLightsOn }) {
  const [triggered, setTriggered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lit, setLit] = useState(false);
  const [flash, setFlash] = useState(false);
  const [revealed, setRevealed] = useState({ names: false, date: false, venue: false, crescent: false });
  const [crescentPhase, setCrescentPhase] = useState(null); // null | 1 | 2 | 3 | "open"
  const [leaving, setLeaving] = useState(false);

  const ropeRef = useRef(null);
  const ropeImgRef = useRef(null);
  const haloRef = useRef(null);
  const triggeredRef = useRef(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const thresholdRef = useRef(100);

  useEffect(() => {
    thresholdRef.current = clamp(Math.round(window.innerHeight * 0.11), 84, 112);
  }, []);

  const resist = (raw) => {
    const T = thresholdRef.current;
    const easy = T * 0.38;
    const firm = T * 0.82;
    if (raw <= easy) return raw * 0.92;
    if (raw <= firm) return easy * 0.92 + (raw - easy) * 0.58;
    return easy * 0.92 + (firm - easy) * 0.58 + (raw - firm) * 0.3;
  };

  const clearRopeInline = () => {
    if (ropeRef.current) {
      ropeRef.current.style.transition = "";
      ropeRef.current.style.transform = "";
    }
    if (ropeImgRef.current) {
      ropeImgRef.current.style.transition = "";
      ropeImgRef.current.style.transform = "";
    }
    if (haloRef.current) {
      haloRef.current.style.transition = "";
      haloRef.current.style.opacity = "";
      haloRef.current.style.transform = "";
    }
  };

  const trigger = () => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    draggingRef.current = false;
    setTriggered(true);
    setDragging(false);
    onLightsOn?.();

    if (navigator.vibrate) {
      try {
        navigator.vibrate([14, 22, 88]);
      } catch {
        /* ignore */
      }
    }

    const rope = ropeRef.current;
    const ropeImg = ropeImgRef.current;
    if (rope && ropeImg) {
      rope.style.transition = "transform 85ms cubic-bezier(.18,0,.6,1)";
      rope.style.transform = "translateX(-50%) rotate(5deg)";
      ropeImg.style.transition = "transform 85ms ease";
      ropeImg.style.transform = "scaleY(1.66)";

      window.setTimeout(() => {
        rope.style.transition = "transform 680ms cubic-bezier(.2,.92,.22,1)";
        rope.style.transform = "translateX(-50%) rotate(-2.2deg)";
        ropeImg.style.transition = "transform 680ms cubic-bezier(.2,.92,.22,1)";
        ropeImg.style.transform = "scaleY(1.16)";
      }, 85);
    }

    window.setTimeout(() => setFlash(true), 140);
    window.setTimeout(() => setFlash(false), 1440);
    window.setTimeout(() => setLit(true), 200);
    window.setTimeout(() => setRevealed((r) => ({ ...r, names: true })), 1200);
    window.setTimeout(() => setRevealed((r) => ({ ...r, date: true })), 2200);
    window.setTimeout(() => setRevealed((r) => ({ ...r, venue: true })), 2550);
    window.setTimeout(() => setRevealed((r) => ({ ...r, crescent: true })), 3100);
  };

  const handlePointerDown = (e) => {
    if (triggeredRef.current) return;
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    startYRef.current = e.clientY;
    clearRopeInline();
    ropeRef.current?.setPointerCapture?.(e.pointerId);

    // Mobile browsers (iOS Safari in particular) only honor autoplay from a
    // discrete gesture like pointerdown/click -- the actual trigger() below
    // fires from a pointermove, which is a continuous event these browsers
    // silently refuse to unlock audio for. Starting playback here too, on
    // first touch of the rope, guarantees at least one play() call happens
    // inside a gesture mobile browsers recognize.
    onLightsOn?.();
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current || triggeredRef.current) return;
    const raw = Math.max(0, e.clientY - startYRef.current);
    const visual = resist(raw);
    const T = thresholdRef.current;
    const progress = Math.min(raw / T, 1);
    const rotation = clamp((visual / T) * 12, -13, 13);
    const stretch = 1 + clamp(visual / (T * 1.45), 0, 0.66);

    if (ropeRef.current) {
      ropeRef.current.style.transform = `translateX(-50%) rotate(${rotation.toFixed(2)}deg)`;
    }
    if (ropeImgRef.current) {
      ropeImgRef.current.style.transform = `scaleY(${stretch.toFixed(3)})`;
    }
    if (haloRef.current) {
      haloRef.current.style.opacity = String(0.24 + progress * 0.72);
      haloRef.current.style.transform = `translateX(-50%) translateY(${(visual * 0.28).toFixed(2)}px) scale(${(1 + progress * 0.76).toFixed(3)})`;
    }

    if (raw >= T) trigger();
  };

  const endDrag = () => {
    draggingRef.current = false;
    setDragging(false);
    if (triggeredRef.current) return;

    if (ropeRef.current) {
      ropeRef.current.style.transition = "transform 520ms cubic-bezier(.34,1.56,.64,1)";
      ropeRef.current.style.transform = "translateX(-50%)";
    }
    if (ropeImgRef.current) {
      ropeImgRef.current.style.transition = "transform 520ms cubic-bezier(.34,1.56,.64,1)";
      ropeImgRef.current.style.transform = "scaleY(1)";
    }
    if (haloRef.current) {
      haloRef.current.style.transition = "opacity 400ms ease, transform 500ms ease";
      haloRef.current.style.opacity = "0";
      haloRef.current.style.transform = "translateX(-50%) scale(1)";
    }
    window.setTimeout(clearRopeInline, 560);
  };

  const skip = () => {
    if (!triggeredRef.current) {
      triggeredRef.current = true;
      setTriggered(true);
      onLightsOn?.();
      setLit(true);
      setRevealed({ names: true, date: true, venue: true, crescent: true });
    }
    if (!leaving) {
      setLeaving(true);
      onOpen?.();
    }
  };

  const tapCrescent = () => {
    if (crescentPhase) return;
    setCrescentPhase(1);
    window.setTimeout(() => setCrescentPhase(2), 200);
    window.setTimeout(() => setCrescentPhase(3), 600);
    window.setTimeout(() => setCrescentPhase("open"), 860);
    window.setTimeout(() => {
      setLeaving(true);
      onOpen?.();
    }, 1200);
  };

  const crescentOpen = crescentPhase === 3 || crescentPhase === "open";

  return (
    <div
      className={`intro ${lit ? "intro--lit" : ""} ${leaving ? "intro--leaving" : ""} ${guest ? "intro--guest" : ""}`}
      aria-hidden={leaving}
    >
      <div className="intro__scene">
        <img
          className={`intro__bg ${lit ? "intro__bg--flicker" : "intro__bg--dim"}`}
          src={courtyardScene}
          alt=""
        />
      </div>
      <div className="intro__scrim" aria-hidden="true" />

      {flash && <div className="intro__flash" />}

      <button className="intro__skip" onClick={skip} type="button">
        skip intro
      </button>

      {!triggered && (
        <button
          ref={ropeRef}
          className={`intro__rope ${dragging ? "intro__rope--dragging" : "intro__rope--idle"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={() => {
            /* keyboard / non-pointer fallback */
          }}
          aria-label="Pull the rope to light our celebration"
          type="button"
        >
          <span ref={haloRef} className="intro__rope-halo" aria-hidden="true" />
          <img ref={ropeImgRef} src={ropeImgSrc} alt="" draggable="false" />
        </button>
      )}

      <div className="intro__content">
        <div className="intro__reveal">
          {guest ? (
            <GuestWelcome guest={guest} visible={revealed.names} />
          ) : (
            <div className={`intro__reveal-item ${revealed.names ? "is-visible" : ""}`}>
              <p className="eyebrow">The Wedding Of</p>
              <h1 className="intro__names">
                {couple.nameOrder === "groom-first" ? (
                  <>
                    {couple.groom}
                    <span className="intro__amp script">&amp;</span>
                    {couple.bride}
                  </>
                ) : (
                  <>
                    {couple.bride}
                    <span className="intro__amp script">&amp;</span>
                    {couple.groom}
                  </>
                )}
              </h1>
            </div>
          )}

          {guest && (
            <div className={`intro__reveal-item ${revealed.date ? "is-visible" : ""}`}>
              <p className="intro__to-wedding">
                <span>to the wedding of</span>
                <span className="intro__to-couple">
                  {couple.nameOrder === "groom-first" ? couple.groom : couple.bride}
                  <span className="intro__amp script">&amp;</span>
                  {couple.nameOrder === "groom-first" ? couple.bride : couple.groom}
                </span>
              </p>
            </div>
          )}

          {!guest && (
            <>
              <div className={`intro__reveal-item ${revealed.date ? "is-visible" : ""}`}>
                <p className="intro__date">{day.date}</p>
              </div>

              <div className={`intro__reveal-item ${revealed.venue ? "is-visible" : ""}`}>
                <p className="intro__venue">{venue.name}</p>
              </div>
            </>
          )}
        </div>

        <div
          className={`intro__reveal-item intro__crescent-scene ${revealed.crescent ? "is-visible" : ""}`}
        >
          <button
            className={`intro__crescent ${crescentPhase ? `intro__crescent--p${crescentPhase}` : ""} ${crescentOpen ? "intro__crescent--open" : ""}`}
            onClick={tapCrescent}
            aria-label="Tap the crescent to join us"
            type="button"
            tabIndex={revealed.crescent ? 0 : -1}
          >
            <span className="intro__crescent-glow" aria-hidden="true" />
            <svg
              className="intro__crescent-svg"
              viewBox="0 0 100 100"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="intro__crescent-ring"
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.5"
              />
              <path
                className="intro__crescent-moon"
                d="M58 26a26 26 0 1 0 0 48 21 21 0 1 1 0-48Z"
                fill="currentColor"
              />
              <g className="intro__crescent-star" opacity={crescentOpen ? 1 : 0}>
                <path d="M74 34l2.4 6.2 6.2 2.4-6.2 2.4-2.4 6.2-2.4-6.2-6.2-2.4 6.2-2.4z" fill="currentColor" />
              </g>
            </svg>
          </button>
          <p className="intro__hint">Tap the crescent to join us</p>
        </div>

        {!revealed.crescent && !triggered && (
          <p className="intro__hint intro__hint--pull">Pull the rope to light our celebration</p>
        )}
      </div>
    </div>
  );
}

/**
 * Replaces the couple's names when the page was opened from a personal
 * invite link: who is invited, how many seats, and (optionally) by name.
 */
function GuestWelcome({ guest, visible }) {
  const { family, count, members, side } = guest;
  const long = family.length > 26 ? "intro__guest-name--long" : family.length > 16 ? "intro__guest-name--mid" : "";
  return (
    <div className={`intro__reveal-item intro__guest ${visible ? "is-visible" : ""}`}>
      <p className="eyebrow">
        {side ? `The ${side === "groom" ? "groom's" : "bride's"} family cordially invites` : "Cordially inviting"}
      </p>
      <h1 className={`intro__guest-name ${long}`}>{family}</h1>

      <div className="intro__guest-rule" aria-hidden="true">
        <span />
        <svg viewBox="0 0 12 12"><path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" fill="currentColor" /></svg>
        <span />
      </div>

      <div className="intro__seats">
        <span className="intro__seats-num">{count}</span>
        <span className="intro__seats-label">
          {count === 1 ? "Guest" : "Guests"}
          <small>seats reserved in your honour</small>
        </span>
      </div>

      {members.length > 0 && (
        <ul className="intro__members" aria-label="Invited guests">
          {members.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
