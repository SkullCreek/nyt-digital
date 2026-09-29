"use client";

// "Try a prompt free" signup. The server re-validates everything (lib/subscribe.ts);
// checks here are only for fast feedback.
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { trackLead } from "@/lib/track";
import { createTurnstile } from "@/lib/turnstile-client";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type State = { kind: "idle" | "sending" | "ok" | "error"; msg: string };

const ERRORS: Record<number, string> = {
  400: "Enter a full email address, like name@studio.com.",
  403: "We couldn't confirm you're a person. Try again.",
  429: "Too many tries from this connection. Try again in 10 minutes.",
  502: "Our email service didn't respond. Try again in a minute, or email info@nyt-studios.com.",
};
const FALLBACK = "That didn't go through. Check your connection and try again.";

export default function SubscribeForm({ source }: { source: string }) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle", msg: "" });
  const widgetEl = useRef<HTMLDivElement>(null);
  const ts = useRef<ReturnType<typeof createTurnstile> | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (widgetEl.current) ts.current = createTurnstile(widgetEl.current, setChecking);
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setState({ kind: "error", msg: ERRORS[400] });
      form.querySelector("input")?.focus();
      return;
    }
    setState({ kind: "sending", msg: "" });
    try {
      const token = (await ts.current?.getToken()) ?? "";
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, company: data.get("company") ?? "", token }),
      });
      if (!res.ok) {
        setState({ kind: "error", msg: ERRORS[res.status] ?? FALLBACK });
        return;
      }
      form.reset();
      trackLead(source);
      setState({ kind: "ok", msg: "Check your inbox and spam folder. Not there in 10 minutes? Email info@nyt-studios.com." });
    } catch {
      setState({ kind: "error", msg: FALLBACK });
    }
  };

  const invalid = state.kind === "error";
  return (
    <form className="sub" onSubmit={submit} onFocus={() => ts.current?.warm()} noValidate>
      <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
      <div className="field" data-invalid={invalid}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          autoCapitalize="off"
          placeholder="you@yourstudio.com"
          required
          aria-invalid={invalid}
          aria-describedby={`${id}-msg ${id}-note`}
          onInput={() => invalid && setState({ kind: "idle", msg: "" })}
        />
        <button type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? <><span className="spin" aria-hidden="true" />Sending…</> : "Send me the prompt"}
        </button>
      </div>
      {/* Honeypot: hidden from people, bots fill it in. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {checking ? <p className="formnote">Tick the box to confirm you&apos;re a person, then we&apos;ll send it.</p> : null}
      <div ref={widgetEl} className="ts" />
      <p id={`${id}-msg`} className="msg" data-kind={state.kind} role={invalid ? "alert" : "status"}>
        {state.msg}
      </p>
      <p id={`${id}-note`} className="formnote">
        We&apos;ll email you the prompt and, now and then, news about our kits. Unsubscribe anytime. <Link href="/privacy">Privacy</Link>
      </p>
    </form>
  );
}
