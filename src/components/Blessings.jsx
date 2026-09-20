import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { GIFT_ICONS, Heart } from "./Ornaments.jsx";
import "./Blessings.css";

export default function Blessings({ data }) {
  return (
    <section id="blessings" className="sec sec--dark sec--geo blessings">
      <Ambient variant="embers" seed={9} />
      <div className="wrap">
        <SectionTitle eyebrow="With Love" title="Your Blessings" />

        <FadeIn as="p" className="lede blessings__intro">
          {data.intro}
        </FadeIn>

        <div className="blessings__grid">
          {data.items.map((item, i) => {
            const Icon = GIFT_ICONS[item.icon] || Heart;
            return (
              <FadeIn className="card blessings__card" key={item.title} delay={0.1 * i}>
                <span className="blessings__badge">
                  <Icon className="blessings__icon" />
                </span>
                <h3 className="blessings__title">{item.title}</h3>
                <p className="blessings__text">{item.text}</p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
