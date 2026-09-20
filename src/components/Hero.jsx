import { useEffect, useRef, useState } from "react";
import { Divider } from "./Ornaments.jsx";
import "./Hero.css";

/**
 * The opening scene. A muted video sits behind a poster; once the intro
 * gate hands off, the video plays, the names fade in, and a soft shower of
 * petals drifts across the screen.
 *
 * The scroll lock lives one level up, in index.tsx -- it targets the
 * nearest scrollable ancestor of the template root rather than
 * document.body directly, which is wrong inside the dashboard editor's own
 * scrollable preview pane. This component just reports back via onOpen.
 */
export default function Hero({ couple, day, hero, opener, video, poster, guest, onOpen, autoOpen = false }) {
  const [opened, setOpened] = useState(false);
  const [petals, setPetals] = useState(false);
  // This template ships no bundled clip -- the still poster is the whole
  // backdrop -- so there's nothing to attempt playing. A future site-specific
  // upload would arrive as a real `video` url, at which point this flips true
  // and actually renders the <video> element below.
  const [videoReady, setVideoReady] = useState(Boolean(video));
  const videoRef = useRef(null);

  // Keep the hero locked to the real visible viewport, so a mobile browser's
  // address bar sliding away mid-tap never yanks the layout underneath it.
  useEffect(() => {
    const root = document.documentElement;
    let width = 0;

    const sync = () => {
      const vv = window.visualViewport;
      const w = Math.round(vv?.width || window.innerWidth);
      if (Math.abs(w - width) < 2) return;
      width = w;
      root.style.setProperty("--visible-height", `${Math.round(vv?.height || window.innerHeight)}px`);
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  function reveal() {
    if (opened) return;
    setOpened(true);
    onOpen?.();
    if (videoReady) videoRef.current?.play().catch(() => setVideoReady(false));

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showAt = window.setTimeout(() => setPetals(true), 900);
      const hideAt = window.setTimeout(() => setPetals(false), 900 + 6200);
      return () => {
        window.clearTimeout(showAt);
        window.clearTimeout(hideAt);
      };
    }
  }

  // The intro gate is what the guest actually interacts with — once it hands
  // off, the hero reveals itself with no tap gate of its own.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (autoOpen) reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen]);

  return (
    <header id="top" className={`hero ${opened ? "is-open" : "is-closed"}`}>
      {videoReady ? (
        <video
          ref={videoRef}
          className="hero__video"
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onError={() => setVideoReady(false)}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="hero__video hero__video--still"
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden="true"
        />
      )}

      <div className="hero__veil" aria-hidden="true" />

      {petals && (
        <div className="hero__petals" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, i) => (
            <i
              key={i}
              style={{
                "--x": `${(i * 137.5) % 100}%`,
                "--delay": `${(i % 13) * 0.32}s`,
                "--dur": `${5.5 + (i % 5) * 0.7}s`,
                "--drift": `${((i % 7) - 3) * 22}px`,
                "--tilt": `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 6) * 8)}deg`,
                "--s": (0.7 + ((i * 37) % 10) / 20).toFixed(2),
              }}
            />
          ))}
        </div>
      )}

      <div className="hero__content">
        <p className="ar hero__bismillah">{opener.arabic}</p>
        <p className="hero__translation">{opener.translation}</p>

        <Divider className="hero__rule" />

        <p className="hero__intro">{guest?.side === "bride" ? hero.introBride : hero.intro}</p>

        <h1 className="hero__names">
          {couple.nameOrder === "groom-first" ? (
            <>
              <span className="hero__name script">{couple.groom}</span>
              <span className="hero__amp">&amp;</span>
              <span className="hero__name script">{couple.bride}</span>
            </>
          ) : (
            <>
              <span className="hero__name script">{couple.bride}</span>
              <span className="hero__amp">&amp;</span>
              <span className="hero__name script">{couple.groom}</span>
            </>
          )}
        </h1>

        <p className="hero__occasion">{hero.occasion}</p>
      </div>

      {opened && (
        <a href="#verse" className="hero__scroll" aria-label="Scroll down">
          <span>Scroll</span>
          <svg viewBox="0 0 18 11" fill="none" aria-hidden="true">
            <path
              d="M1 1.5 9 9.5 17 1.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </header>
  );
}
