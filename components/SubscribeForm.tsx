"use client";

// "Try a prompt free" signup. Server route + Turnstile are wired in phase 4;
// the server re-validates everything, this is only for fast feedback.
import { useId, useState, type FormEvent } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type State = { kind: "idle" | "sending" | "ok" | "error"; msg: string };

export default function SubscribeForm({ source }: { source: string }) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle", msg: "" });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setState({ kind: "error", msg: "Enter a full email address, like name@studio.com." });
      form.querySelector("input")?.focus();
      return;
    }
    setState({ kind: "sending", msg: "" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, company: data.get("company") ?? "" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState({ kind: "ok", msg: "Check your inbox. Your free prompt is on its way." });
    } catch {
      setState({ kind: "error", msg: "That didn't go through. Check your connection and try again." });
    }
  };

  const invalid = state.kind === "error";
  return (
    <form className="sub" onSubmit={submit} noValidate>
      <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
      <div className="field" data-invalid={invalid}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@yourstudio.com"
          required
          aria-invalid={invalid}
          aria-describedby={`${id}-msg`}
          onInput={() => invalid && setState({ kind: "idle", msg: "" })}
        />
        <button type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? <><span className="spin" aria-hidden="true" />Sending</> : "Send me the prompt"}
        </button>
      </div>
      {/* Honeypot: hidden from people, bots fill it in. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p id={`${id}-msg`} className="msg" data-kind={state.kind} role={invalid ? "alert" : "status"}>
        {state.msg}
      </p>
    </form>
  );
}
