import { useState } from "react";
import "./MusicToggle.css";

/** Floating play/pause control for the background track that starts the
 * instant the invitation's wax seal is tapped (see Hero's openInvitation) —
 * this only ever pauses/resumes it, so `playing` starts true. */
export default function MusicToggle({ audioRef }) {
  const [playing, setPlaying] = useState(true);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? "is-playing" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
    >
      <span className="music-toggle__bar" />
      <span className="music-toggle__bar" />
      <span className="music-toggle__bar" />
    </button>
  );
}
