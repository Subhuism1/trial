import { useEffect, useRef, useState } from "react";

// Imported before any component: styles.css carries the base `.sec` rules
// that each component's own CSS overrides at the same specificity, so
// source order decides.
import "./styles.css";

import weddingData from "./data.js";
import { WeddingDataProvider, useWeddingData } from "./lib/wedding-data-context.jsx";
import BackgroundMusic from "./lib/background-music.jsx";
import { useScrollLock } from "./lib/use-scroll-lock.js";
import { useLegacyWeddingData } from "./legacy-wedding-data.js";
import { readGuestFromUrl } from "./lib/guest-invite.js";
import IntroGate from "./components/IntroGate.jsx";
import Hero from "./components/Hero.jsx";
import Verse from "./components/Verse.jsx";
import Invite from "./components/Invite.jsx";
import PhotoBand from "./components/PhotoBand.jsx";
import Events from "./components/Events.jsx";
import Countdown from "./components/Countdown.jsx";
import Venue from "./components/Venue.jsx";
import DressCode from "./components/DressCode.jsx";
import Rsvp from "./components/Rsvp.jsx";
import Blessings from "./components/Blessings.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import SectionDivider from "./components/SectionDivider.jsx";
import MusicToggle from "./components/MusicToggle.jsx";

// Sections that are "glued" to the next one -- no floral divider after them
// (dress code + RSVP, hosts + footer).
const NO_DIVIDER_AFTER = new Set(["dressCode", "hosts"]);

// Set when the page was opened from a personal link made on /create.html.
const guest = readGuestFromUrl();

function DocumentTitle() {
  const { couple } = useWeddingData();
  useEffect(() => {
    const [first, second] =
      couple.nameOrder === "bride-first" ? [couple.brideName, couple.groomName] : [couple.groomName, couple.brideName];
    document.title = guest
      ? `${guest.family} — Invitation to ${first} & ${second}'s Wedding`
      : `${first} & ${second} — Wedding Invitation`;
  }, [couple.groomName, couple.brideName, couple.nameOrder]);
  return null;
}

function Invitation() {
  const data = useWeddingData();
  const wedding = useLegacyWeddingData();
  const audioRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const [opened, setOpened] = useState(false);

  // Page stays pinned at the top until the hero has finished revealing.
  useScrollLock(!opened);

  // Called synchronously from the rope pull / "skip intro" click, so the
  // browser's autoplay policy sees a real user gesture.
  function playMusic() {
    audioRef.current?.play().catch(() => {});
  }

  function handleIntroOpen() {
    window.setTimeout(() => setShowIntro(false), 1300);
  }

  const sectionRenderers = {
    envelop: () => <Invite key="envelop" data={wedding.invite} couple={wedding.couple} hosts={wedding.contact} />,
    timeline: () => <Events key="timeline" events={wedding.events} guest={guest} />,
    countdown: () => <Countdown key="countdown" day={wedding.day} venue={wedding.venue} couple={wedding.couple} />,
    venue: () => (
      <Venue key="venue" data={wedding.venue} photo={wedding.photos.venueCard} extra={wedding.additionalVenues} />
    ),
    dressCode: () => <DressCode key="dressCode" data={wedding.dressCode} />,
    contact: () => (wedding.rsvp.enabled ? <Rsvp key="contact" data={wedding.rsvp} /> : null),
    gifts: () => <Blessings key="gifts" data={wedding.blessings} />,
    hosts: () => <Contact key="hosts" data={wedding.contact} />,
    footer: () => <Footer key="footer" couple={wedding.couple} data={wedding.footer} />,
  };

  // The two full-width photo bands are pinned after "envelop" and "contact".
  const sections = [];
  let prevId = "verse";
  for (const id of data.sectionOrder) {
    // A section that renders nothing (RSVP switched off, say) must not leave
    // its divider behind -- two garlands would end up stacked.
    const node = sectionRenderers[id]?.();
    if (node) {
      if (!NO_DIVIDER_AFTER.has(prevId)) sections.push(<SectionDivider key={`div-${id}`} />);
      sections.push(node);
      prevId = id;
    }
    if (id === "envelop") {
      sections.push(<SectionDivider key="div-band-one" />);
      sections.push(<PhotoBand key="band-one" {...wedding.photos.bandOne} alt="" />);
    }
    if (id === "contact") {
      sections.push(<SectionDivider key="div-band-two" />);
      sections.push(<PhotoBand key="band-two" {...wedding.photos.bandTwo} alt="" />);
    }
  }

  return (
    <div className="tmpl-khatim">
      <BackgroundMusic ref={audioRef} src={data.music} />
      {showIntro && (
        <IntroGate
          couple={wedding.couple}
          day={wedding.day}
          venue={wedding.venue}
          guest={guest}
          onOpen={handleIntroOpen}
          onLightsOn={playMusic}
        />
      )}
      {opened && <MusicToggle audioRef={audioRef} />}

      <a href="#top" className="skip-link">
        Skip to content
      </a>

      <main>
        <Hero
          couple={wedding.couple}
          day={wedding.day}
          hero={wedding.hero}
          opener={wedding.opener}
          video={wedding.photos.heroVideo}
          poster={wedding.photos.heroPoster}
          guest={guest}
          onOpen={() => setOpened(true)}
          autoOpen={!showIntro}
        />
        <SectionDivider />
        <Verse data={wedding.verse} />
        {sections}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WeddingDataProvider data={weddingData}>
      <DocumentTitle />
      <Invitation />
    </WeddingDataProvider>
  );
}
