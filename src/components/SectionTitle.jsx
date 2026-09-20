import FadeIn from "./FadeIn.jsx";
import { Divider } from "./Ornaments.jsx";
import "./SectionTitle.css";

export default function SectionTitle({ eyebrow, title }) {
  return (
    <div className="sectitle">
      <FadeIn as="p" className="eyebrow">
        {eyebrow}
      </FadeIn>
      <FadeIn as="h2" className="title sectitle__h" delay={0.08}>
        {title}
      </FadeIn>
      <FadeIn delay={0.14}>
        <Divider className="sectitle__rule" />
      </FadeIn>
    </div>
  );
}
