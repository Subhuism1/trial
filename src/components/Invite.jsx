import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import { CornerFret, Crescent, Divider } from "./Ornaments.jsx";
import "./Invite.css";

/** One side of the couple: role, full name, parents' line. */
function Person({ role, name, parents }) {
  return (
    <div className="invite__person">
      <p className="invite__role">{role}</p>
      <h3 className="invite__name">{name}</h3>
      {parents && <p className="invite__parents">{parents}</p>}
    </div>
  );
}

// `hosts` is the ordered host list (groom's side first, bride's second) --
// it carries the full names and "S/o ... / D/o ..." lines.
export default function Invite({ data, couple, hosts = [] }) {
  const groomSide = hosts.find((h) => h.key === "groom");
  const brideSide = hosts.find((h) => h.key === "bride");

  const groom = (
    <Person role="The Groom" name={groomSide?.person || couple.groomFull} parents={groomSide?.parents} />
  );
  const bride = (
    <Person role="The Bride" name={brideSide?.person || couple.brideFull} parents={brideSide?.parents} />
  );
  const [first, second] = couple.nameOrder === "groom-first" ? [groom, bride] : [bride, groom];

  return (
    <section id="invite" className="sec sec--geo invite">
      <Ambient variant="haze" seed={4} />
      <div className="wrap">
        <FadeIn className="invite__card">
          <CornerFret className="corner corner--tl" />
          <CornerFret className="corner corner--tr" />
          <CornerFret className="corner corner--bl" />
          <CornerFret className="corner corner--br" />

          <span className="invite__crest" aria-hidden="true">
            <Crescent className="invite__crest-icon" />
          </span>

          <p className="eyebrow">Our Invitation</p>
          <h2 className="invite__greeting">{data.greeting}</h2>
          <Divider className="invite__rule" />

          <p className="invite__message">{data.message}</p>

          <div className="invite__couple">
            {first}
            <span className="invite__amp script" aria-hidden="true">
              &amp;
            </span>
            {second}
          </div>

          <p className="script invite__sign">{data.signature}</p>
        </FadeIn>
      </div>
    </section>
  );
}
