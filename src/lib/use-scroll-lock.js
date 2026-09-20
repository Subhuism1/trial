import { useEffect } from "react";

// A hard (non-smooth) jump -- styles.css sets `scroll-behavior: smooth`, and
// mobile browsers cancel a smooth scroll the moment a finger touches the screen.
function jumpToTop() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = prev;
}

// Pins the page at the top while the intro gate is showing.
// `position: fixed` on body (not just overflow: hidden) is what stops
// mobile Safari from scrolling the page underneath the overlay.
export function useScrollLock(locked) {
  useEffect(() => {
    const body = document.body;
    const clear = () => {
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
    };

    if (!locked) {
      clear();
      return;
    }

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    jumpToTop();
    body.style.position = "fixed";
    body.style.top = "0";
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    return () => {
      clear();
      jumpToTop();
      requestAnimationFrame(jumpToTop);
    };
  }, [locked]);
}
