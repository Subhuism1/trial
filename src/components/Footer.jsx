import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import { Monogram } from "./Ornaments.jsx";
import "./Footer.css";

export default function Footer({ couple, data }) {
  return (
    <footer className="footer sec--dark">
      <Ambient variant="embers" seed={11} />
      <span className="footer__skyline" aria-hidden="true" />
      <div className="wrap footer__inner">
        <FadeIn>
          <Monogram initials={couple.initials} className="footer__monogram" />
        </FadeIn>

        <FadeIn as="h2" className="footer__names" delay={0.08}>
          {couple.nameOrder === "groom-first" ? (
            <>
              {couple.groom} <span className="script">&amp;</span> {couple.bride}
            </>
          ) : (
            <>
              {couple.bride} <span className="script">&amp;</span> {couple.groom}
            </>
          )}
        </FadeIn>

        <FadeIn as="p" className="footer__message" delay={0.14}>
          {data.message}
          <span className="ar footer__dua" lang="ar">
            {data.duaArabic}
          </span>
        </FadeIn>

        <FadeIn className="footer__meta" delay={0.2}>
          <span className="footer__hash">{couple.hashtag}</span>
          <span className="footer__meta-dot" />
          <span>{data.dateLine}</span>
        </FadeIn>
      </div>
    </footer>
  );
}
