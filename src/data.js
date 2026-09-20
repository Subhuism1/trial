// ═══════════════════════════════════════════════════════════
//  Saara website content yahin se badlo.
//  (Couple names, date, venue, events, families, gifts, RSVP...)
// ═══════════════════════════════════════════════════════════

const weddingData = {
  couple: {
    brideName: "Mahira",
    groomName: "Faizan",
    hashtag: "#FaizanWedsMahira",
    // "groom-first" ya "bride-first" -- hero/footer mein naam ka order
    nameOrder: "groom-first",
  },

  // Countdown isi date/time tak chalta hai
  weddingDateTime: "2027-03-14T17:00:00+05:30",
  ceremonyStart: "5:00 PM",
  // Hero ki lines. Groom side ke link pe "son", bride side ke link pe "daughter".
  heroOccasion: "Wedding Ceremony",
  heroIntro: "We invite you to celebrate our beloved son",
  heroIntroBride: "We invite you to celebrate our beloved daughter",
  countdownLabel: "Nikah",

  venue: {
    name: "Gulzar Bagh & Banquet",
    address: "9 Shahjahani Road, New Market, Bhopal, Madhya Pradesh",
    city: "Bhopal",
    mapsUrl: "https://maps.google.com/?q=Gulzar+Bagh+Banquet+Bhopal",
    note: "Valet parking available at the main gate",
  },

  // Doosra venue (jaise reception alag jagah ho) -- chahiye to uncomment karo.
  additionalVenues: [
    // { name: "...", address: "...", mapsUrl: "https://maps.google.com/?q=...", note: "" },
  ],

  // Har event ka card: photo (public/ mein rakho), date, time, jagah aur
  // Google Maps link. mapsUrl na do to "location" se apne aap Maps link ban jaata hai.
  // Naam Mehendi / Haldi / Sangeet / Nikah / Walima ho to Arabic label apne aap lagta hai.
  // Saare cards pe "scratch to reveal" hota hai -- date/time/jagah scratch karke dikhti hai.
  events: [
    {
      id: "mehndi-nikah",
      name: "Mehndi + Nikah",
      detail: "Henna & The Ceremony",
      date: "13 March 2027",
      time: "6:00 PM",
      location: "Gulzar Bagh & Banquet — Main Hall",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gulzar+Bagh+Banquet+Bhopal",
      photo: "/templates/khatim/event-mehndi.jpg",
      // Scratch foil kitna bada ho: "full" (poora card), "below-photo"
      // (photo chhod kar baaki) ya "details" (sirf neeche ki details).
      scratch: "full",
    },
    {
      id: "barat",
      name: "Barat",
      detail: "The Procession",
      date: "14 March 2027",
      time: "4:00 PM",
      location: "Gulzar Bagh & Banquet — Main Gate",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gulzar+Bagh+Banquet+Bhopal",
      photo: "/templates/khatim/event-sangeet.jpg",
      scratch: "below-photo",
      // Personal link se aaya guest yahan dekhta hai ki uske kitne log invited hain
      showGuests: true,
    },
    {
      id: "walima",
      name: "Walima",
      detail: "Reception",
      date: "14 March 2027",
      time: "8:30 PM",
      location: "Gulzar Bagh & Banquet — Grand Lawn",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gulzar+Bagh+Banquet+Bhopal",
      photo: "/templates/khatim/event-walima.jpg",
      scratch: "details",
    },
  ],

  // Apni photos: public/ folder mein rakho, phir "/photo1.jpg" jaisa path do.
  // [0] = pehla photo band, [1] = doosra photo band, [2] = venue card,
  // [3], [4]... = additionalVenues ki photos.
  // Khaali chhodo to template ki apni default images dikhengi.
  gallery: [
    // { url: "/photo1.jpg", caption: "May Allah bless you both" },
    // { url: "/photo2.jpg", caption: "" },
    // { url: "/venue.jpg" },
  ],

  story: {
    greetingLine1: "Dear",
    greetingLine2: "Family & Friends",
    message:
      "By the grace of Allah, we joyfully invite you to be part of our Nikah and Walima celebrations. Your presence, prayers, and blessings would mean the world to us as we begin this new journey together.",
  },

  dressCode: {
    title: "Festive Formal",
    text: "Dress in your festive best — rich colours, graceful drapes and a little sparkle. We kindly ask guests to avoid overly casual attire.",
    // "For Him" / "For Her" cards
    him: ["Sherwani", "Kurta Pajama", "Bandhgala / Jodhpuri", "Formal Suit"],
    her: ["Lehenga", "Anarkali", "Saree", "Sharara / Gharara"],
    // Suggested colours (swatches dikhte hain). Hatana ho to list khaali kar do.
    palette: [
      { name: "Emerald", color: "#0e5a47" },
      { name: "Antique Gold", color: "#c6a15b" },
      { name: "Blush", color: "#e7b8b2" },
      { name: "Maroon", color: "#7a1f2b" },
      { name: "Sage", color: "#8fae9b" },
    ],
    // In rangon se bachne ki request
    avoid: [
      { name: "White", color: "#ffffff" },
      { name: "Ivory", color: "#f4ecd8" },
    ],
  },

  hosts: {
    groomSide: {
      relation: "Groom's Family",
      person: "Faizan Ahmed Ansari",
      subtitle: "S/o Mr. Zubair Ansari & Mrs. Shaheen Ansari",
      phone: "+91 98123 45678",
    },
    brideSide: {
      relation: "Bride's Family",
      person: "Mahira Fatima Sheikh",
      subtitle: "D/o Mr. Naveed Sheikh & Mrs. Rukhsar Sheikh",
      phone: "+91 98765 12345",
    },
    // Aur families add karni ho to:
    additional: [
      // { id: "x1", relation: "Hosted By", person: "...", subtitle: "...", phone: "..." },
    ],
  },

  gifts: [
    { title: "Your Presence", text: "Your love, your laughter, and your prayers are gift enough for us." },
    { title: "Your Duas", text: "Please keep us in your prayers as we begin this new chapter, In Sha Allah." },
  ],

  footer: {
    message: "Thank you for being a part of our story.",
  },

  rsvp: {
    enabled: false, // RSVP section chhupa hua hai -- wapas chahiye to true karo
    deadline: "1 March 2027",
    customMessage: "We have saved you a seat — kindly let us know if you can join us.",
    // Kisi field ko chhupana ho to false karo
    fields: { mobile: true, email: true, guestCount: true, message: true },
  },

  // Background music -- apna gaana public/ mein daal ke path badal do.
  music: "/templates/khatim/music.mp3",

  // Sections ka order -- kuch hatana ho to us id ko list se hata do.
  // "venue" aur "dressCode" hata diye gaye hain. Wapas chahiye to unki id
  // yahan list mein dobara likh do (venue = venue card, dressCode = dress code).
  sectionOrder: ["scratchReveal", "envelop", "timeline", "countdown", "contact", "gifts", "hosts", "footer"],
};

export default weddingData;
