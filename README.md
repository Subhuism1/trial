# Khatim — Wedding Invitation (standalone)

SaaS ka Khatim template, alag standalone Vite + React project. Koi watermark nahi, koi SaaS/database dependency nahi.

## Chalana

```
npm install      # sirf pehli baar
npm run dev      # http://localhost:5173
npm run build    # final static site dist/ mein (Netlify/Vercel/kahin bhi upload karo)
```

## Kya kahan badlein

| Kya | File |
|---|---|
| Naam, date, venue(s), events, dress code, families, gifts, RSVP, music, section order | `src/data.js` |
| Fixed text (Bismillah, Quran verse, scratch card, hero lines, blessings intro) | `src/legacy-wedding-data.js` |
| Rang / fonts | `src/styles.css` (top pe CSS variables) |
| Intro gate (rope pull + crescent) | `src/components/IntroGate.jsx` + `.css` |
| Kisi section ka design / code | `src/components/<Section>.jsx` + `.css` |
| Images, music | `public/templates/khatim/` |
| Page layout / dividers / section rendering | `src/App.jsx` |
| Google Fonts | `index.html` |

- **Photos:** `public/` mein daalo aur `src/data.js` ke `gallery` mein path likho.
- **RSVP:** abhi form sirf "thank you" dikhata hai. Responses save karne ho to `src/components/Rsvp.jsx` ke top pe `RSVP_ENDPOINT` mein POST URL (Formspree / Google Apps Script) daalo.

## Personal invite links (har family ke liye)

- `npm run dev` chala ke **http://localhost:5173/create.html** kholo (live site pe: `https://<aapka-domain>/create.html`).
- Family ka naam, groom/bride side aur kitne log invited hain bharo (ya "With Family") → **Link banao & copy karo**.
- Link chhota aur readable banta hai: `/?upadhyay-family-3` (groom side), `/?upadhyay-family-3b` (bride side), aur ginti ki jagah pura khandan invite karna ho to `/?upadhyay-family-f`. Link mein "and" likha ho to "&" dikhta hai.
- Kitne log invited hain, wo do jagah dikhta hai: intro screen pe aur Wedding Events mein us event ke card pe jiske `data.js` mein `showGuests: true` likha ho (abhi Barat).
- Hero ki line groom side pe `heroIntro` aur bride side pe `heroIntroBride` se aati hai.
- Bina `?to=` wala normal link pehle jaisa couple ke naam dikhata hai.
- Site live hone ke baad create page ke **Website address** mein apna domain daal do, taaki links localhost ki jagah live site pe khulein.
- Banaye hue links ki list sirf usi browser mein save hoti hai (groom aur bride ki list alag-alag phone pe alag rahegi).
- `create.html` ka link public mein share mat karo — us pe koi password nahi hai.

## Wedding events

- Events `src/data.js` ke `events` mein hain: naam, date, time, jagah, `mapsUrl` aur `photo`.
- Har card pe "scratch to reveal" hai: guest gold foil scratch karke date, time, jagah aur Google Maps button dekhta hai. Neeche "Reveal all events" button bhi hai.
- `mapsUrl` na do to jagah (location) se Google Maps link apne aap ban jaata hai.
- Event photos `public/templates/khatim/event-*.jpg` hain (original cards ka neeche wala illustration crop kiya hua). Nikah ke liye `hero-poster.jpg` lagi hai; apni photo ho to `photo` badal do.

## Baaki sections

- **Invitation card:** dulha-dulhan ke poore naam aur "S/o / D/o" line `src/data.js` ke `hosts` se aate hain.
- **Countdown:** "Add to Google Calendar" aur "Apple / Outlook" (.ics) buttons `weddingDateTime` + venue se apne aap bante hain.
- **Dress code:** `dressCode.him` / `dressCode.her` (outfit list), `dressCode.palette` (kapde ke swatches wala fan) aur `dressCode.avoid` (in rangon se bachein) -- naam + hex colour. Khaali list = wo hissa nahi dikhega.
- **Contact:** har number pe Call + WhatsApp button. 10 digit number ho to WhatsApp ke liye +91 maana jaata hai.
