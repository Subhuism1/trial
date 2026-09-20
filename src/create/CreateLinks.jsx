import { useEffect, useMemo, useState } from "react";
import weddingData from "../data.js";
import { buildInviteUrl } from "../lib/guest-invite.js";
import "./CreateLinks.css";

// Everything here is saved only in this browser (localStorage) -- the links
// themselves carry the guest details, so nothing needs a server.
const LIST_KEY = "khatim.inviteLinks";
const BASE_KEY = "khatim.inviteBaseUrl";

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode -- list just won't persist */
  }
}

function defaultBaseUrl() {
  return `${window.location.origin}/`;
}

const { groomName, brideName, nameOrder } = weddingData.couple;
const [first, second] = nameOrder === "bride-first" ? [brideName, groomName] : [groomName, brideName];

function whatsappText(entry) {
  return (
    `Assalamu Alaikum, ${entry.family} ✨\n\n` +
    `You are cordially invited to the wedding of ${first} & ${second}` +
    (entry.withFamily ? " (with family).\n\n" : ` (${entry.count} ${entry.count === 1 ? "guest" : "guests"}).\n\n`) +
    `Please open your personal invitation:\n${entry.url}`
  );
}

export default function CreateLinks() {
  const [side, setSide] = useState("groom");
  const [family, setFamily] = useState("");
  const [count, setCount] = useState(2);
  // "With Family" -- no head count, the whole family is invited
  const [withFamily, setWithFamily] = useState(false);
  const [baseUrl, setBaseUrl] = useState(() => load(BASE_KEY, null) ?? defaultBaseUrl());
  // Rebuilt on load so links saved in the old long format switch to the short one.
  const [list, setList] = useState(() =>
    load(LIST_KEY, []).map((e) => {
      try {
        return { ...e, url: buildInviteUrl(load(BASE_KEY, null) ?? defaultBaseUrl(), e) };
      } catch {
        return e;
      }
    })
  );
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => save(LIST_KEY, list), [list]);
  useEffect(() => save(BASE_KEY, baseUrl), [baseUrl]);

  let previewUrl = "";
  try {
    if (family.trim()) previewUrl = buildInviteUrl(baseUrl, { family, count, withFamily, side });
  } catch {
    /* invalid website address */
  }

  const shown = filter === "all" ? list : list.filter((e) => e.side === filter);
  const totals = useMemo(
    () => ({
      families: shown.length,
      guests: shown.reduce((n, e) => n + (e.withFamily ? 0 : e.count || 0), 0),
      openFamilies: shown.filter((e) => e.withFamily).length,
    }),
    [shown]
  );

  function makeUrl(entry) {
    return buildInviteUrl(baseUrl, entry);
  }

  function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!family.trim()) {
      setError("Family / guest ka naam likho.");
      return;
    }
    try {
      new URL(baseUrl);
    } catch {
      setError("Website address sahi nahi hai (https:// se shuru hona chahiye).");
      return;
    }
    const entry = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      side,
      family: family.trim(),
      withFamily,
      count: withFamily ? null : Math.max(count, 1),
      createdAt: Date.now(),
    };
    entry.url = makeUrl(entry);
    setList((l) => [entry, ...l]);
    setFamily("");
    setCount(2);
    setWithFamily(false);
    copy(entry);
  }

  async function copy(entry) {
    try {
      await navigator.clipboard.writeText(entry.url);
    } catch {
      window.prompt("Copy this link:", entry.url);
    }
    setCopiedId(entry.id);
    window.setTimeout(() => setCopiedId((id) => (id === entry.id ? null : id)), 1800);
  }

  function remove(entry) {
    if (window.confirm(`"${entry.family}" ka link list se hata dein? (Bheja hua link phir bhi kaam karega.)`)) {
      setList((l) => l.filter((e) => e.id !== entry.id));
    }
  }

  // If the website address changes, rebuild every saved link to point at it.
  function applyBaseUrl(value) {
    setBaseUrl(value);
    try {
      new URL(value);
      setList((l) => l.map((e) => ({ ...e, url: buildInviteUrl(value, e) })));
    } catch {
      /* wait for a valid URL */
    }
  }

  return (
    <div className="cl">
      <header className="cl__head">
        <p className="cl__eyebrow">Personal Invitations</p>
        <h1 className="cl__title">
          {first} <span className="cl__amp">&amp;</span> {second}
        </h1>
        <p className="cl__sub">
          Har family ke liye alag link banao. Link kholte hi invitation pe unka naam aur kitne log invited hain, dikhega.
        </p>
      </header>

      <div className="cl__grid">
        <form className="cl__card cl__form" onSubmit={handleCreate}>
          <h2 className="cl__card-title">Naya link banao</h2>

          <div className="cl__field">
            <span className="cl__label">Kiski taraf se</span>
            <div className="cl__seg" role="radiogroup">
              {[
                ["groom", `Groom · ${groomName}`],
                ["bride", `Bride · ${brideName}`],
              ].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  role="radio"
                  aria-checked={side === val}
                  className={side === val ? "is-on" : ""}
                  onClick={() => setSide(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="cl__field">
            <span className="cl__label">Family / family head ka naam</span>
            <input
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              placeholder="e.g. Janab Rafiq Ahmed & Family"
              maxLength={80}
              autoFocus
            />
          </label>

          <div className="cl__field">
            <span className="cl__label">Kitne log invited hain</span>
            <div className="cl__count">
              <div className={`cl__stepper ${withFamily ? "is-off" : ""}`.trim()}>
                <button
                  type="button"
                  onClick={() => {
                    setWithFamily(false);
                    setCount((c) => Math.max(1, c - 1));
                  }}
                  aria-label="Kam karo"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={count}
                  onChange={(e) => {
                    setWithFamily(false);
                    setCount(Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)));
                  }}
                  aria-label="Guest count"
                />
                <button
                  type="button"
                  onClick={() => {
                    setWithFamily(false);
                    setCount((c) => Math.min(99, c + 1));
                  }}
                  aria-label="Badhao"
                >
                  +
                </button>
              </div>

              <span className="cl__count-or">ya</span>

              {/* no head count -- the invitation just says "With Family" */}
              <button
                type="button"
                className={`cl__family-btn ${withFamily ? "is-on" : ""}`.trim()}
                aria-pressed={withFamily}
                onClick={() => setWithFamily((v) => !v)}
              >
                With Family
              </button>
            </div>
          </div>

          {previewUrl && (
            <p className="cl__preview">
              Link: <span>{previewUrl}</span>
            </p>
          )}

          {error && <p className="cl__error">{error}</p>}

          <button className="cl__primary" type="submit">
            Link banao &amp; copy karo
          </button>

          <details className="cl__advanced">
            <summary>Website address</summary>
            <p>
              Links is address pe khulenge. Site live hone ke baad yahan apna domain daalo (jaise
              https://faizan-mahira.netlify.app/) — purane saved links bhi update ho jaayenge.
            </p>
            <input value={baseUrl} onChange={(e) => applyBaseUrl(e.target.value)} spellCheck={false} />
          </details>
        </form>

        <section className="cl__card cl__list">
          <div className="cl__list-head">
            <h2 className="cl__card-title">Invited families</h2>
            <div className="cl__tabs">
              {[
                ["all", "All"],
                ["groom", "Groom"],
                ["bride", "Bride"],
              ].map(([val, label]) => (
                <button key={val} type="button" className={filter === val ? "is-on" : ""} onClick={() => setFilter(val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="cl__stats">
            <div>
              <strong>{totals.families}</strong>
              <span>Families</span>
            </div>
            <div>
              <strong>{totals.guests}</strong>
              <span>
                Guests
                {totals.openFamilies > 0 && (
                  <em>
                    + {totals.openFamilies} with family
                  </em>
                )}
              </span>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="cl__empty">Abhi koi link nahi bana. Left side form bharo.</p>
          ) : (
            <ul className="cl__items">
              {shown.map((e) => (
                <li key={e.id} className="cl__item">
                  <div className="cl__item-main">
                    <span className={`cl__tag cl__tag--${e.side}`}>{e.side === "groom" ? "Groom" : "Bride"}</span>
                    <p className="cl__item-name">{e.family}</p>
                    <p className="cl__item-meta">
                      {e.withFamily ? <b>With family</b> : <><b>{e.count}</b> {e.count === 1 ? "guest" : "guests"}</>}
                    </p>
                    <p className="cl__item-url">{e.url.replace(/^https?:\/\//, "")}</p>
                  </div>
                  <div className="cl__item-actions">
                    <button type="button" onClick={() => copy(e)}>
                      {copiedId === e.id ? "Copied ✓" : "Copy"}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(whatsappText(e))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="cl__wa"
                    >
                      WhatsApp
                    </a>
                    <a href={e.url} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                    <button type="button" className="cl__del" onClick={() => remove(e)} aria-label={`Remove ${e.family}`}>
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
