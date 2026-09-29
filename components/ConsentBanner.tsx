"use client";

// Cookie banner (checklist item 5). Opt-in with equal Accept/Reject in strict regions,
// notice + opt-out elsewhere. Reopened from the footer's "Cookie settings" button.
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { OPEN_EVENT, readConsent, regionMode, saveConsent, type Mode } from "@/lib/consent";
import { Check } from "./icons";

export default function ConsentBanner() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [mode, setMode] = useState<Mode>("strict");
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setMode(regionMode());
    setMarketing(c.marketing);
    if (!c.decided) setOpen(true);
    const reopen = () => {
      setMarketing(readConsent().marketing);
      setSettings(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = (value: boolean) => {
    saveConsent(value);
    setOpen(false);
    setSettings(false);
  };

  if (!open) return null;

  return (
    <section className="consent" role="dialog" aria-modal="false" aria-labelledby={`${id}-t`}>
      <h2 id={`${id}-t`}>Cookies</h2>
      <p>
        {mode === "strict"
          ? "We'd like to use cookies from Meta and Whop to see which ads bring people here. Nothing is set until you choose."
          : "We use cookies from Meta and Whop to see which ads bring people here. You can turn them off."}{" "}
        <Link href="/privacy#cookies">How we use them</Link>
      </p>

      {settings ? (
        <div className="prefs">
          <div className="pref">
            <div>
              <b>Essential</b>
              <span>Remembers this choice. Always on.</span>
            </div>
            <span className="always">On</span>
          </div>
          <label className="pref" htmlFor={`${id}-m`}>
            <div>
              <b>Ad measurement</b>
              <span>Meta Pixel and Whop Pixel.</span>
            </div>
            {/* toggle (ref: uiverse Bodyhc/loud-badger-7) */}
            <input id={`${id}-m`} type="checkbox" role="switch" className="switch" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span className="track" aria-hidden="true"><Check /><i /></span>
          </label>
        </div>
      ) : null}

      <div className="consent-actions">
        {settings ? (
          <button type="button" className="cbtn solid" onClick={() => decide(marketing)}>Save choice</button>
        ) : mode === "strict" ? (
          <>
            <button type="button" className="cbtn solid" onClick={() => decide(false)}>Reject</button>
            <button type="button" className="cbtn solid" onClick={() => decide(true)}>Accept</button>
          </>
        ) : (
          <button type="button" className="cbtn solid" onClick={() => decide(true)}>OK</button>
        )}
        {settings ? null : (
          <button type="button" className="cbtn plain" onClick={() => setSettings(true)}>Settings</button>
        )}
      </div>
    </section>
  );
}

export function CookieSettingsButton() {
  return (
    <button type="button" className="linkbtn" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
