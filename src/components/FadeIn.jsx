import { useEffect, useRef, useState } from "react";

/** Fades and lifts its children into place the first time they scroll into view. */
export default function FadeIn({ as: Tag = "div", className = "", delay = 0, show, style, children, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const driven = show !== undefined;

  useEffect(() => {
    if (driven) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Reveal on entry, but also reveal anything already scrolled past — on a
        // reload partway down the page those would otherwise stay blank forever.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [driven]);

  const visible = driven ? show : seen;

  return (
    <Tag
      ref={ref}
      className={`fade ${visible ? "in" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
