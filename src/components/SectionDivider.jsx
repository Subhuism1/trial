import "./SectionDivider.css";

/** A floral garland set between sections, echoing a keepsake invitation. */
export default function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <img
        className="section-divider__mark"
        src="/templates/khatim/floral-divider.webp"
        alt=""
        draggable="false"
        loading="lazy"
      />
    </div>
  );
}
