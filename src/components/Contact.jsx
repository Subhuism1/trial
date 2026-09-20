import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { CornerFret } from "./Ornaments.jsx";
import { hostGridClass } from "../lib/hosts.js";
import "./Contact.css";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.79.97-.14.16-.29.19-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42l-.76-1.83c-.2-.48-.4-.41-.56-.42h-.48a.92.92 0 0 0-.67.31 2.8 2.8 0 0 0-.87 2.08 4.9 4.9 0 0 0 1.02 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.69 2.23.75 3.03.63.49-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z"
      />
    </svg>
  );
}

// `data` is the ordered list of host blocks -- the groom's and bride's
// sides plus any extras the couple added (see the adapter's `contact`).
export default function Contact({ data: sides }) {
  return (
    <section id="contact" className="sec sec--alt sec--geo contact">
      <Ambient variant="haze" seed={10} />
      <div className="wrap">
        <SectionTitle eyebrow="Get In Touch" title="Hosts & Contact" />

        <div className={hostGridClass("contact__grid", sides.length)}>
          {sides.map((side, i) => (
            <FadeIn className="card card--gold contact__card" key={side.key} delay={0.1 * i}>
              <CornerFret className="corner corner--tl" />
              <CornerFret className="corner corner--tr" />
              <p className="contact__label">{side.label}</p>
              <h3 className="contact__person">{side.person}</h3>
              {side.parents && <p className="contact__parents">{side.parents}</p>}

              {side.phones.map((phone) => {
                const dial = phone.replace(/[^\d+]/g, "");
                // wa.me needs the country code; a bare 10-digit number is taken as Indian
                const digits = phone.replace(/\D/g, "");
                const wa = digits.length === 10 ? `91${digits}` : digits;
                return (
                  <div className="contact__phone" key={phone}>
                    <p className="contact__number">{phone}</p>
                    <div className="contact__actions">
                      <a className="contact__btn contact__btn--call" href={`tel:${dial}`}>
                        <PhoneIcon />
                        Call
                      </a>
                      <a
                        className="contact__btn contact__btn--wa"
                        href={`https://wa.me/${wa}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <WhatsAppIcon />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
