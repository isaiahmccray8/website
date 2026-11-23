"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATS, ITEMS } from "@/lib/catalog";
import { computeQuote, money } from "@/lib/pricing";

export default function QuoteBuilder() {
  const router = useRouter();
  const [tab, setTab] = useState(CATS[0].id);
  const [cart, setCart] = useState({});
  const [rush, setRush] = useState(false);
  const [codeIn, setCodeIn] = useState("");
  const [promo, setPromo] = useState(null); // {code,pct}
  const [codeMsg, setCodeMsg] = useState(["", ""]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", website: "", details: "", contactPref: "text" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const q = useMemo(() => computeQuote(cart, { rush, discountPct: promo?.pct || 0 }), [cart, rush, promo]);
  const cat = CATS.find((c) => c.id === tab);
  const count = (c) => c.items.filter((i) => cart[i.id]).length;
  const setQty = (id, n) => setCart((c) => { const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = Math.min(99, n); return x; });

  // Nudge toward a package when à-la-carte updates add up
  const alaCarte = q.lines.filter((l) => ITEMS[l.id].cat === "updates").reduce((s, l) => s + l.amount, 0);
  const hasPackage = Object.keys(cart).some((id) => ITEMS[id].cat === "maint");

  async function applyCode() {
    const code = codeIn.trim();
    if (!code) { setPromo(null); setCodeMsg(["", ""]); return; }
    try {
      const r = await fetch("/api/promo?code=" + encodeURIComponent(code)).then((r) => r.json());
      if (r.valid) { setPromo(r); setCodeMsg(["ok", `✓ ${r.code} applied: ${r.pct}% off. Thanks for the love!`]); }
      else { setPromo(null); setCodeMsg(["bad", "That code isn't valid."]); }
    } catch { setCodeMsg(["bad", "Couldn't check that code. Try again."]); }
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true); setError("");
    try {
      const r = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cart, rush, promo: promo?.code || "" }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      router.push(`/order/${data.id}?new=1`);
    } catch (err) { setError(err.message); setSending(false); }
  }

  const f = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <>
      <div className="tabs" role="tablist">
        {CATS.map((c) => (
          <button key={c.id} className={"tab" + (tab === c.id ? " on" : "")} role="tab" aria-selected={tab === c.id} onClick={() => setTab(c.id)}>
            {c.icon} {c.name}{count(c) > 0 && <span className="n">{count(c)}</span>}
          </button>
        ))}
      </div>

      <div className="layout">
        <div>
          <div className="cat-intro">
            <div className="icon">{cat.icon}</div>
            <div><h3>{cat.name}</h3><p>{cat.blurb}</p></div>
          </div>
          <div className="grid">
            {cat.items.map((i) => {
              const n = cart[i.id] || 0;
              return (
                <div key={i.id} className={"item" + (i.hot ? " hot" : "") + (n ? " in" : "")}>
                  {i.hot && <span className="tag mono">Popular</span>}
                  <h4>{i.n}</h4>
                  {i.from && <div className="from">Starting at</div>}
                  <div className="price" style={i.from ? { marginTop: 0 } : null}>
                    {money(i.p * 100)}{i.mo ? <small>/mo</small> : i.unit ? <small>/{i.unit}</small> : null}
                  </div>
                  <ul>{i.f.map((x) => <li key={x}>{x}</li>)}</ul>
                  <div className="addrow">
                    {i.unit && n ? (
                      <>
                        <div className="stepper">
                          <button aria-label="Less" onClick={() => setQty(i.id, n - 1)}>−</button>
                          <span>{n}</span>
                          <button aria-label="More" onClick={() => setQty(i.id, n + 1)}>+</button>
                        </div>
                        <span className="mono muted" style={{ flex: 1, textAlign: "right" }}>{money(i.p * 100 * n)}</span>
                      </>
                    ) : (
                      <button className={"add" + (n ? " in" : "")} onClick={() => setQty(i.id, n ? 0 : 1)}>{n ? "✓ Added" : "+ Add"}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="receipt" id="receipt" aria-live="polite">
          <h3>YOUR QUOTE</h3>
          <div className="sub">McCray Made · prices update as you pick</div>
          {!q.lines.length && <div className="rline muted"><span>Tap “+ Add” on anything you need</span></div>}
          {q.lines.some((l) => !l.monthly) && <div className="rgroup">ONE-TIME</div>}
          {q.lines.filter((l) => !l.monthly).map((l) => (
            <div className="rline" key={l.id}>
              <span>{l.qty > 1 ? `${l.qty} × ` : ""}{l.name}{l.from ? "*" : ""}</span>
              <span>{money(l.amount)}<button title="Remove" onClick={() => setQty(l.id, 0)}>×</button></span>
            </div>
          ))}
          {q.rushAmt > 0 && <div className="rline"><span>Rush (+25%)</span><span>{money(q.rushAmt)}</span></div>}
          {q.monthly > 0 && <div className="rgroup">MONTHLY (FIRST MONTH DUE NOW)</div>}
          {q.lines.filter((l) => l.monthly).map((l) => (
            <div className="rline" key={l.id}><span>{l.name}</span><span>{money(l.amount)}/mo<button title="Remove" onClick={() => setQty(l.id, 0)}>×</button></span></div>
          ))}
          {q.discount > 0 && <div className="rline disc"><span>{promo.code} (−{promo.pct}%)</span><span>−{money(q.discount)}</span></div>}
          <div className="hr" />
          <div className="total"><span>Total</span><span>{money(q.total)}</span></div>
          {q.total > 0 && <div className="fine">50% deposit after I confirm: {money(Math.round(q.total / 2))}</div>}
          {q.hasFrom && <div className="fine">* Starting price. I'll confirm the final price before you pay anything.</div>}
          {alaCarte >= 25000 && !hasPackage && (
            <div className="tip">💡 Your updates add up to {money(alaCarte)}. <b>The Refresh</b> covers up to 6 updates for $250, or <b>The Glow-Up</b> covers 12 for $450.</div>
          )}
          <div className="switch">
            <span>Rush delivery (24 hrs, +25%)</span>
            <div className={"toggle" + (rush ? " on" : "")} role="switch" aria-checked={rush} tabIndex={0}
              onClick={() => setRush(!rush)} onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), setRush(!rush))} />
          </div>
          <div className="code">
            <input placeholder="Promo code" value={codeIn} maxLength={20} aria-label="Promo code" onChange={(e) => setCodeIn(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCode()} />
            <button onClick={applyCode}>Apply</button>
          </div>
          <div className={"msg " + codeMsg[0]}>{codeMsg[1]}</div>
          <button className="btn lime block" style={{ marginTop: 10 }} disabled={!q.lines.length} onClick={() => setOpen(true)}>Place my order →</button>
          <p className="fine" style={{ textAlign: "center" }}>No payment yet. I'll review and confirm first.</p>
        </aside>
      </div>

      <div className={"bar" + (q.lines.length ? " show" : "")}>
        <span>Quote: <b>{money(q.total)}</b></span><a href="#receipt">Review & order</a>
      </div>

      {open && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && !sending && setOpen(false)}>
          <form className="mbox form" onSubmit={submit}>
            <div>
              <h3>Almost done 🙌</h3>
              <p className="muted">Total: <b>{money(q.total)}</b> · {q.lines.length} item{q.lines.length > 1 ? "s" : ""}. I'll text you to confirm, usually within 24 hours.</p>
            </div>
            <div className="row2">
              <label>Your name *<input required {...f("name")} autoComplete="name" /></label>
              <label>Phone *<input required type="tel" {...f("phone")} autoComplete="tel" /></label>
            </div>
            <label>Email *<input required type="email" {...f("email")} autoComplete="email" /></label>
            <div className="row2">
              <label>Business name<input {...f("business")} /></label>
              <label>Website (if you have one)<input {...f("website")} placeholder="yourbusiness.com" /></label>
            </div>
            <label>What exactly do you need done?
              <textarea {...f("details")} placeholder="e.g. Replace the 4 photos on the homepage, add a size chart page, update prices on the hoodies…" />
            </label>
            <label>Best way to reach you
              <select {...f("contactPref")}><option value="text">Text</option><option value="call">Call</option><option value="email">Email</option></select>
            </label>
            {error && <p className="error">{error}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn" onClick={() => setOpen(false)} disabled={sending}>Back</button>
              <button type="submit" className="btn lime" style={{ flex: 1 }} disabled={sending}>{sending ? "Sending…" : "Send my order"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
