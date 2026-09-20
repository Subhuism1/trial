import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import { Star } from "./Ornaments.jsx";
import "./Verse.css";

export default function Verse({ data }) {
  return (
    <section id="verse" className="sec sec--dark sec--geo verse">
      <Ambient variant="embers" seed={2} />
      <div className="wrap">
        <FadeIn className="card card--gold verse__card">
          <Star className="verse__star" />
          <p className="ar verse__arabic">{data.arabic}</p>
          <p className="verse__translation">{data.translation}</p>
          <p className="verse__ref">{data.reference}</p>
        </FadeIn>
      </div>
    </section>
  );
}
