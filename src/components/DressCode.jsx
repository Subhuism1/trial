import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import "./DressCode.css";

/** Line-drawn sherwani: long coat, placket, stole over one shoulder. */
function HimFigure() {
  return (
    <svg viewBox="0 0 80 120" fill="none" className="dresscode__figure" aria-hidden="true">
      <circle cx="40" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M35.5 20.5h9v4.5h-9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path
        className="dresscode__fill"
        d="M31 25h18l10 7 2.5 64H18.5L21 32z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M21 32 14 78M59 32l7 46" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M40 25v71" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {[35, 44, 53, 62, 71].map((y) => (
        <circle key={y} cx="40" cy={y} r="1.1" fill="currentColor" />
      ))}
      <path d="M33 25c6 18-3 40 3 71" stroke="currentColor" strokeWidth="2.2" opacity="0.45" strokeLinecap="round" />
      <path d="M18.5 90h43" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
      <path d="M31 96v20M49 96v20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** Line-drawn anarkali: fitted bodice, flared skirt with border, dupatta. */
function HerFigure() {
  return (
    <svg viewBox="0 0 80 120" fill="none" className="dresscode__figure" aria-hidden="true">
      <circle cx="40" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M30 14c1-9 19-9 20 0" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path
        className="dresscode__fill"
        d="M33 24h14l3 22H30zM30 46c-7 20-15 44-21 64h62c-6-20-14-44-21-64z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M33 26 24 58M47 26l9 32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M36 46 30 110M40 46v64M44 46l6 64M33 46l-12 64M47 46l12 64"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />
      <path d="M12 101h56" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <path d="M12.5 104.5h55" stroke="currentColor" strokeWidth="0.7" opacity="0.5" strokeDasharray="1.5 2" />
      <path
        d="M32 16c-10 16-16 44-12 80"
        stroke="currentColor"
        strokeWidth="2.2"
        opacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Look({ title, items, Figure, delay }) {
  if (!items.length) return null;
  return (
    <FadeIn className="dresscode__look" delay={delay}>
      <div className="dresscode__window">
        <Figure />
      </div>
      <h3 className="dresscode__look-title">{title}</h3>
      <ul className="dresscode__items">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </FadeIn>
  );
}

export default function DressCode({ data }) {
  const palette = data.palette ?? [];
  const avoid = data.avoid ?? [];
  const mid = (palette.length - 1) / 2;

  return (
    <section id="dress-code" className="sec sec--dark sec--geo dresscode">
      <Ambient variant="embers" seed={8} />
      <div className="wrap">
        <SectionTitle eyebrow="What To Wear" title="Dress Code" />

        <FadeIn className="dresscode__theme">
          <span className="dresscode__theme-tag">The theme</span>
          <p className="script dresscode__theme-name">{data.title}</p>
          <p className="dresscode__text">{data.text}</p>
        </FadeIn>

        <div className="dresscode__stage">
          <Look title="For Him" items={data.him ?? []} Figure={HimFigure} delay={0.05} />

          {palette.length > 0 && (
            <FadeIn className="dresscode__palette" delay={0.12}>
              <p className="dresscode__palette-label">Colours we love</p>
              {/* fabric swatches fanned out like a tailor's sample book */}
              <div className="dresscode__fan" style={{ "--count": palette.length }}>
                {palette.map((c, i) => (
                  <span
                    key={c.name}
                    className="dresscode__fabric"
                    style={{ "--chip": c.color, "--turn": i - mid }}
                    title={c.name}
                  />
                ))}
              </div>
              <ul className="dresscode__legend">
                {palette.map((c) => (
                  <li key={c.name}>
                    <span style={{ background: c.color }} aria-hidden="true" />
                    {c.name}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}

          <Look title="For Her" items={data.her ?? []} Figure={HerFigure} delay={0.18} />
        </div>

        {avoid.length > 0 && (
          <FadeIn className="dresscode__avoid" delay={0.2}>
            <span className="dresscode__avoid-label">Kindly avoid</span>
            {avoid.map((c) => (
              <span className="dresscode__avoid-chip" key={c.name}>
                <span className="dresscode__avoid-dot" style={{ background: c.color }} aria-hidden="true" />
                {c.name}
              </span>
            ))}
          </FadeIn>
        )}
      </div>
    </section>
  );
}
