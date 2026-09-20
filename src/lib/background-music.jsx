import { forwardRef } from "react";

// Plain looping <audio>. App.jsx and MusicToggle.jsx call
// .play() / .pause() / .volume on this ref.
const BackgroundMusic = forwardRef(function BackgroundMusic({ src }, ref) {
  if (!src) return null;
  return <audio ref={ref} src={src} loop preload="auto" />;
});

export default BackgroundMusic;
