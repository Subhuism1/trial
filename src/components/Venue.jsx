import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { CornerFret } from "./Ornaments.jsx";
import "./Venue.css";

const qr = (url) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&color=16352E&bgcolor=FFFDF6&data=${encodeURIComponent(url)}`;

/** One venue card -- the primary venue and every additional one (a couple
 * with a separate ceremony/reception venue) render through this same
 * markup, just with their own name/address/photo/note. */
function VenueCard({ data, photo, delay }) {
  return (
    <FadeIn className="card card--gold venue__card" delay={delay}>
      <CornerFret className="corner corner--tl" />
      <CornerFret className="corner corner--br" />

      {/* the photograph is cut to a mehrab — the arch the whole ornament
          set is built from — rather than sat in a rectangular header */}
      {photo && (
        <div className="venue__arch">
          <img
            className="venue__photo"
            src={photo}
            alt={`${data.name} — the venue`}
            loading="lazy"
            onError={(e) => (e.currentTarget.parentElement.style.display = "none")}
          />
        </div>
      )}

      <div className="venue__body">
        <h3 className="venue__name">{data.name}</h3>
        <p className="venue__address">{data.address}</p>

        {data.note && (
          <p className="venue__note">
            <span className="venue__note-dot" />
            {data.note}
          </p>
        )}

        {data.mapsUrl && (
          <div className="venue__actions">
            <a className="btn btn--fill venue__btn" href={data.mapsUrl} target="_blank" rel="noreferrer">
              Open in Maps
            </a>

            <figure className="venue__qr">
              <img
                src={qr(data.mapsUrl)}
                alt={`QR code linking to ${data.name} on Google Maps`}
                width={120}
                height={120}
                loading="lazy"
              />
              <figcaption>Scan</figcaption>
            </figure>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

export default function Venue({ data, photo, extra }) {
  // Not a destructured default (`extra = []`) -- with no JSDoc/prop types on
  // this plain .jsx component, TypeScript infers a bare `[]` default's type
  // as `never[]`, which then rejects the real array of venue objects passed
  // in from index.tsx.
  const extraVenues = extra ?? [];

  return (
    <section id="venue" className="sec sec--alt sec--geo venue">
      <Ambient variant="haze" seed={7} />
      <div className="wrap">
        <SectionTitle eyebrow="Where To Find Us" title="The Venue" />

        <VenueCard data={data} photo={photo} />

        {/* A separate ceremony/reception venue, or any other extra stop --
            each gets its own labelled card below the primary one, same
            markup, its own optional photo (see gallery[3+i] in the editor). */}
        {extraVenues.map((venue, i) => (
          <div className="venue__extra" key={venue.name || i}>
            <p className="eyebrow venue__extra-label">Venue {i + 2}</p>
            <VenueCard data={venue} photo={venue.photo} delay={0.08 * (i + 1)} />
          </div>
        ))}
      </div>
    </section>
  );
}
