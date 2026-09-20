import FadeIn from "./FadeIn.jsx";
import "./PhotoBand.css";

/**
 * A full-width photograph used as a divider between sections.
 * Shown at full strength — a photo should look like a photo, not a watermark.
 * Any text sits on a scrim so it stays readable.
 */
export default function PhotoBand({ src, alt = "", quote, sub, tall = false }) {
  if (!src) return null;

  return (
    <FadeIn className={`band ${tall ? "band--tall" : ""}`.trim()}>
      <img className="band__img" src={src} alt={alt} loading="lazy" />
      {(quote || sub) && (
        <div className="band__veil">
          {quote && <p className="band__quote ar">{quote}</p>}
          {sub && <p className="band__sub">{sub}</p>}
        </div>
      )}
    </FadeIn>
  );
}
