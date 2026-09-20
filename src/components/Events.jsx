import { useState } from "react";
import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import ScratchFoil from "./ScratchFoil.jsx";
import { CornerFret } from "./Ornaments.jsx";
import "./Events.css";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// "12 March 2027" -> { day: "12", rest: "March 2027" }
function splitDate(text) {
  const m = /^\s*(\d{1,2})\s+(.+)$/.exec(text ?? "");
  return m ? { day: m[1], rest: m[2] } : { day: "", rest: text ?? "" };
}

/** The personal "seats held for you" ribbon -- only on the event the couple
 *  marked with `showGuests` (the Barat), and only for a personal link. */
function SeatsRibbon({ guest }) {
  return (
    <p className="events__seats">
      <span className="events__seats-count">{guest.withFamily ? "With Family" : guest.count}</span>
      <span className="events__seats-text">
        {guest.withFamily
          ? "you and your family are invited"
          : `${guest.count === 1 ? "seat" : "seats"} reserved for the ${guest.family}`}
      </span>
    </p>
  );
}

function EventCard({ event, index, revealAll, onRevealed, guest }) {
  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);
  const { day, rest } = splitDate(event.date);

  return (
    <FadeIn className="card card--gold events__card" delay={0.07 * (index % 3)}>
      <CornerFret className="corner corner--tl" />
      <CornerFret className="corner corner--br" />

      {event.photo && (
        // cut to a mehrab, the same arch the venue card uses
        <div className="events__arch">
          <img
            className="events__photo"
            src={event.photo}
            alt={`${event.name} — ${event.subtitle}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.parentElement.style.display = "none";
            }}
          />
        </div>
      )}

      <span className="events__num">{String(index + 1).padStart(2, "0")}</span>

      {event.arabic && <p className="ar events__arabic">{event.arabic}</p>}
      <h3 className="events__name">{event.name}</h3>
      {event.subtitle && <p className="events__subtitle">{event.subtitle}</p>}

      {guest && <SeatsRibbon guest={guest} />}

      <span className="events__line" />

      <div className={`events__details ${revealed ? "is-revealed" : ""} ${touched ? "is-touched" : ""}`}>
        <div className="events__info" aria-hidden={!revealed}>
          {event.weekday && <p className="events__weekday">{event.weekday}</p>}
          <p className="events__date">
            {day && <span className="events__day">{day}</span>}
            <span className="events__month">{rest}</span>
          </p>
          {event.time && <p className="events__time">{event.time}</p>}
          {event.place && <p className="events__place">{event.place}</p>}
          {event.mapUrl && (
            <a
              className="events__map"
              href={event.mapUrl}
              target="_blank"
              rel="noreferrer"
              tabIndex={revealed ? 0 : -1}
            >
              <PinIcon />
              Open in Maps
            </a>
          )}
        </div>

        <ScratchFoil
          revealed={revealAll}
          onStart={() => setTouched(true)}
          onReveal={() => {
            setRevealed(true);
            onRevealed();
          }}
        />
      </div>
    </FadeIn>
  );
}

export default function Events({ events, guest }) {
  // The seat count rides on the event flagged in data.js, else the last one.
  const seatsOn = events.find((e) => e.showGuests)?.id ?? events[events.length - 1]?.id;
  const [revealAll, setRevealAll] = useState(false);
  const [count, setCount] = useState(0);
  const allOpen = revealAll || count >= events.length;

  return (
    <section id="events" className="sec sec--alt sec--geo events">
      <Ambient variant="haze" seed={5} />
      <div className="wrap">
        <SectionTitle eyebrow="Celebrating Together" title="Wedding Events" />

        <p className="events__lead">
          Every celebration holds a little secret — scratch the gold on each card to reveal the day, time and place.
        </p>

        <div className="events__grid">
          {events.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={i}
              revealAll={revealAll}
              guest={guest && event.id === seatsOn ? guest : null}
              onRevealed={() => setCount((n) => n + 1)}
            />
          ))}
        </div>

        {!allOpen && (
          <div className="events__all">
            <button type="button" className="events__all-btn" onClick={() => setRevealAll(true)}>
              Reveal all events
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
