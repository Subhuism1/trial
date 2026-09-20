import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { isRsvpFieldOn } from "../lib/rsvp-fields.js";
import FadeIn from "./FadeIn.jsx";
import Ambient from "./Ambient.jsx";
import SectionTitle from "./SectionTitle.jsx";
import "./Rsvp.css";

/** A single warm burst over the confirmation card. */
function celebrate() {
  const colors = ["#c6a15b", "#e3c989", "#6e9384", "#0e362f"];
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.4 },
    colors,
  });
}

const blank = {
  name: "",
  phone: "",
  email: "",
  attending: "",
  guests: "1",
  message: "",
  website: "", // honeypot — real guests never see this field
};

// RSVP responses kahin save karne hain (Formspree, Google Apps Script, apna
// server...) to uska POST URL yahan daalo. Khaali rahe to form sirf
// "thank you" dikhata hai, kuch save nahi hota.
const RSVP_ENDPOINT = "";

export default function Rsvp({ data }) {
  const [fields, setFields] = useState(blank);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const showMobile = isRsvpFieldOn(data.fields, "mobile");
  const showEmail = isRsvpFieldOn(data.fields, "email");
  const showGuestCount = isRsvpFieldOn(data.fields, "guestCount");
  const showMessage = isRsvpFieldOn(data.fields, "message");

  const set = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (key === "attending") setError("");
  };

  async function submit(e) {
    e.preventDefault();
    if (!fields.name.trim()) return;

    if (!fields.attending) {
      setError("Please let us know whether you can join us.");
      return;
    }

    // Honeypot: only a bot fills a field it cannot see. Show the same screen so
    // it learns nothing, but never treat it as a real response.
    if (fields.website) {
      setSent(true);
      return;
    }

    setError("");

    // No backend wired up yet -- just show the confirmation.
    if (!RSVP_ENDPOINT) {
      setSent(true);
      return;
    }

    try {
      const res = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: fields.name.trim(),
          phone: fields.phone.trim(),
          email: fields.email.trim(),
          attending: fields.attending,
          guestCount: fields.guests === "5+" ? 5 : Number(fields.guests) || 1,
          message: fields.message.trim(),
          website: fields.website,
        }),
      });
      if (!res.ok) throw new Error("RSVP submission failed");
      setSent(true);
    } catch {
      setError("Something went wrong sending your RSVP. Please try again.");
    }
  }

  const declined = fields.attending === "no";

  // Fire once, and only for a joyful RSVP — a decline doesn't need confetti.
  useEffect(() => {
    if (sent && !declined) celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sent]);

  return (
    <section id="rsvp" className="sec sec--alt sec--geo rsvp">
      <Ambient variant="filigree" seed={8} />
      <div className="wrap">
        <SectionTitle eyebrow="Kindly Respond" title="Will You Join Us?" />

        <FadeIn as="p" className="lede rsvp__intro">
          {data.message}
          {data.deadline ? (
            <>
              {" "}
              Please reply by <strong>{data.deadline}</strong>.
            </>
          ) : null}
        </FadeIn>

        {sent ? (
          <FadeIn className="card rsvp__card rsvp__done" show>
            <span className="rsvp__tick" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <path
                  d="M11 20.5 17.5 27 29 14"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="rsvp__done-title">
              {declined ? "Thank you for letting us know" : "Jazak Allah Khair"}
            </h3>
            <p className="rsvp__done-text">
              {declined
                ? "You will be missed on the day — please keep us in your duas."
                : "Your response has been noted. We cannot wait to celebrate with you, In Sha Allah."}
            </p>
            <button
              type="button"
              className="rsvp__again"
              onClick={() => {
                setFields(blank);
                setError("");
                setSent(false);
              }}
            >
              Send another response
            </button>
          </FadeIn>
        ) : (
          <FadeIn as="form" className="card rsvp__card" onSubmit={submit}>
            {(() => {
              const nameField = (
                <label className="rsvp__field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={fields.name}
                    onChange={set("name")}
                  />
                </label>
              );
              if (!showMobile) return nameField;
              return (
                <div className="rsvp__row">
                  {nameField}
                  <label className="rsvp__field">
                    <span>Mobile Number</span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 00000 00000"
                      value={fields.phone}
                      onChange={set("phone")}
                    />
                  </label>
                </div>
              );
            })()}

            {showEmail && (
              <label className="rsvp__field">
                <span>Email Address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={set("email")}
                />
              </label>
            )}

            <fieldset className="rsvp__group">
              <legend>Will you attend?</legend>
              <div className="rsvp__options">
                {[
                  { v: "yes", label: "Joyfully accept" },
                  { v: "no", label: "Regretfully decline" },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    className={`rsvp__option ${fields.attending === opt.v ? "is-on" : ""}`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={opt.v}
                      checked={fields.attending === opt.v}
                      onChange={set("attending")}
                    />
                    <span className="rsvp__radio" />
                    {opt.label}
                  </label>
                ))}
              </div>
              {error && (
                <p className="rsvp__error" role="alert">
                  {error}
                </p>
              )}
            </fieldset>

            {showGuestCount && (
              <fieldset className="rsvp__group">
                <legend>Number of guests (including you)</legend>
                <div className="rsvp__pills">
                  {data.guestOptions.map((n) => (
                    <label key={n} className={`rsvp__pill ${fields.guests === n ? "is-on" : ""}`}>
                      <input
                        type="radio"
                        name="guests"
                        value={n}
                        checked={fields.guests === n}
                        onChange={set("guests")}
                      />
                      {n}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {showMessage && (
              <label className="rsvp__field">
                <span>Message for the couple (optional)</span>
                <textarea
                  rows="3"
                  placeholder="Leave your wishes here..."
                  value={fields.message}
                  onChange={set("message")}
                />
              </label>
            )}

            <div className="rsvp__trap" aria-hidden="true">
              <label htmlFor="rsvp-website">Website</label>
              <input
                id="rsvp-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={fields.website}
                onChange={set("website")}
              />
            </div>

            <button type="submit" className="btn btn--fill rsvp__submit">
              Send RSVP
            </button>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
