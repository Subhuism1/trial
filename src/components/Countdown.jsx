import { useEffect, useState } from "react";
import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import "./Countdown.css";

const pad = (n) => String(n).padStart(2, "0");

function left(iso) {
  const gap = new Date(iso).getTime() - Date.now();
  const ms = Math.max(0, gap);
  return {
    done: gap <= 0,
    days: pad(Math.floor(ms / 86400000)),
    hours: pad(Math.floor((ms / 3600000) % 24)),
    minutes: pad(Math.floor((ms / 60000) % 60)),
    seconds: pad(Math.floor((ms / 1000) % 60)),
  };
}

// Server and first client render both start here (a fixed value, not one
// derived from Date.now()) so the two match exactly. Computing the real
// remaining time during render instead would bake the server's timestamp
// into the HTML and mismatch the client's by however long the response
// took, which React reports as a hydration error. The prototype this was
// ported from was a client-only Vite app, so it could afford to seed real
// state.
const ZERO = { done: false, days: "00", hours: "00", minutes: "00", seconds: "00" };

// 2027-03-14T11:30:00.000Z -> 20270314T113000Z
const calStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Google Calendar link + an .ics file (Apple / Outlook) for the main day. */
function calendarLinks({ title, iso, hours = 5, location, details }) {
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + hours * 3600000);
  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${calStamp(start)}/${calStamp(end)}` +
    `&location=${encodeURIComponent(location)}` +
    `&details=${encodeURIComponent(details)}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${calStamp(start)}-wedding@invite`,
    `DTSTAMP:${calStamp(new Date())}`,
    `DTSTART:${calStamp(start)}`,
    `DTEND:${calStamp(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${details}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { google, ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Countdown({ day, venue, couple }) {
  const [time, setTime] = useState(ZERO);

  useEffect(() => {
    // Deliberate: ZERO above exists only to make the server and first
    // client render agree, so the real value has to land right after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(left(day.iso));
    const id = setInterval(() => setTime(left(day.iso)), 1000);
    return () => clearInterval(id);
  }, [day.iso]);

  const [first, second] =
    couple?.nameOrder === "bride-first" ? [couple?.bride, couple?.groom] : [couple?.groom, couple?.bride];
  const cal = calendarLinks({
    title: `${day.countdownLabel} — ${first} & ${second}`,
    iso: day.iso,
    location: [venue?.name, venue?.address].filter(Boolean).join(", "),
    details: `The ${day.countdownLabel} of ${first} & ${second}. ${typeof window !== "undefined" ? window.location.origin : ""}`,
  });

  const boxes = [
    { key: "days", label: "Days", value: time.days },
    { key: "hours", label: "Hours", value: time.hours },
    { key: "minutes", label: "Minutes", value: time.minutes },
    { key: "seconds", label: "Seconds", value: time.seconds },
  ];

  return (
    <section id="countdown" className="sec sec--geo countdown">
      <Ambient variant="embers" seed={6} />
      <div className="wrap">
        <SectionTitle eyebrow="Save The Date" title={time.done ? "The day is here" : "Counting Down"} />

        <FadeIn className="countdown__row">
          {boxes.map((box) => (
            <div className="countdown__box" key={box.key}>
              <span className="countdown__num">
                {box.value.split("").map((digit, di) => (
                  // Re-keying on the digit remounts the span so the roll replays.
                  <span className="countdown__digit" key={`${di}-${digit}`}>
                    {digit}
                  </span>
                ))}
              </span>
              <span className="countdown__label">{box.label}</span>
            </div>
          ))}
        </FadeIn>

        <FadeIn as="p" className="countdown__note" delay={0.12}>
          Until our {day.countdownLabel} on{" "}
          <strong>
            {day.weekday}, {day.date}
          </strong>{" "}
          at <strong>{day.nikahTime}</strong>
        </FadeIn>

        {cal && !time.done && (
          <FadeIn className="countdown__cal" delay={0.16}>
            <a className="countdown__cal-btn countdown__cal-btn--fill" href={cal.google} target="_blank" rel="noreferrer">
              <CalendarIcon />
              Add to Google Calendar
            </a>
            <a className="countdown__cal-btn" href={cal.ics} download="wedding.ics">
              <CalendarIcon />
              Apple / Outlook
            </a>
          </FadeIn>
        )}

        <FadeIn as="p" className="ar countdown__dua" delay={0.18}>
          إِنْ شَاءَ اللَّٰه
        </FadeIn>
      </div>
    </section>
  );
}
