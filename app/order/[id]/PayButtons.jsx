"use client";
import { useState } from "react";
import { money } from "@/lib/pricing";

export default function PayButtons({ orderId, deposit, balance }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  async function pay(kind) {
    setBusy(kind); setErr("");
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, kind }) });
      const d = await r.json();
      if (!r.ok || !d.url) throw new Error(d.error || "Couldn't start payment.");
      window.location.href = d.url;
    } catch (e) { setErr(e.message); setBusy(""); }
  }

  return (
    <div style={{ marginTop: 16, display: "grid", gap: 10, fontFamily: "var(--font-body)" }}>
      {deposit > 0 && (
        <button className="btn lime block" disabled={!!busy} onClick={() => pay("deposit")}>
          {busy === "deposit" ? "Opening checkout…" : `Pay 50% deposit · ${money(deposit)}`}
        </button>
      )}
      <button className={"btn block " + (deposit > 0 ? "" : "lime")} disabled={!!busy} onClick={() => pay("full")}>
        {busy === "full" ? "Opening checkout…" : `${deposit > 0 ? "Pay in full" : "Pay balance"} · ${money(balance)}`}
      </button>
      <p className="fine" style={{ textAlign: "center" }}>Card · Apple Pay · Cash App Pay · Secured by Stripe</p>
      {err && <p className="error">{err}</p>}
    </div>
  );
}
