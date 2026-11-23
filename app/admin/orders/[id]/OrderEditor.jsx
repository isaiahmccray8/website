"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES } from "@/lib/catalog";
import { money } from "@/lib/pricing";

const MESSAGES = {
  new: (n, l) => `Hi ${n}, this is Isaiah from McCray Made! I got your order and I'm reviewing it now. Track it here: ${l}`,
  approved: (n, l) => `Hi ${n}, your McCray Made order is confirmed! Pay your deposit here to get on the schedule: ${l}`,
  in_progress: (n, l) => `Hi ${n}, I've started working on your order. You can follow along here: ${l}`,
  completed: (n, l) => `Hi ${n}, your work is done! Take a look, and when you're happy you can pay the balance here: ${l}`,
  paid: (n) => `Thank you ${n}! You're all paid up. I appreciate your business. If you know anyone who needs tech help, send them my way 🙏`,
  cancelled: (n) => `Hi ${n}, your McCray Made order has been cancelled. Text me if you have any questions.`,
};

export default function OrderEditor({ order, link }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [finalTotal, setFinalTotal] = useState(order.final_total_cents != null ? (order.final_total_cents / 100).toString() : "");
  const [customerNote, setCustomerNote] = useState(order.customer_note || "");
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [manualPayment, setManualPayment] = useState("");
  const [manualMethod, setManualMethod] = useState("Cash App");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const first = order.name.split(" ")[0];
  const text = (MESSAGES[status] || MESSAGES.new)(first, link);

  async function save(e) {
    e?.preventDefault();
    setSaving(true); setMsg("");
    const r = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, finalTotal, customerNote, adminNotes, manualPayment, manualMethod }),
    });
    const d = await r.json();
    setSaving(false);
    if (!r.ok) return setMsg("❌ " + (d.error || "Save failed"));
    setManualPayment("");
    setStatus(d.order.status);
    setMsg("✓ Saved");
    router.refresh();
  }

  async function copy(t) {
    try { await navigator.clipboard.writeText(t); setMsg("✓ Copied"); } catch { setMsg("Couldn't copy, so select the text manually"); }
  }

  return (
    <div>
      <form className="panel form" onSubmit={save}>
        <h3>Update order</h3>
        <label>Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label>Final total ($) <span className="muted" style={{ fontWeight: 400, fontSize: ".82rem" }}>Leave blank to keep the quoted {money(order.total_cents)}</span>
          <input inputMode="decimal" value={finalTotal} onChange={(e) => setFinalTotal(e.target.value)} placeholder={(order.total_cents / 100).toString()} />
        </label>
        <label>Note to customer <span className="muted" style={{ fontWeight: 400, fontSize: ".82rem" }}>(shows on their order page)</span>
          <textarea value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} placeholder="e.g. Final price includes 3 extra product listings we discussed." />
        </label>
        <label>Private notes
          <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Logins they sent, to-do list, etc." style={{ minHeight: 80 }} />
        </label>
        <div className="row2">
          <label>Record a payment ($)<input inputMode="decimal" value={manualPayment} onChange={(e) => setManualPayment(e.target.value)} placeholder="0" /></label>
          <label>Paid with<select value={manualMethod} onChange={(e) => setManualMethod(e.target.value)}><option>Cash App</option><option>Cash</option><option>Zelle</option><option>Apple Cash</option><option>Other</option></select></label>
        </div>
        <p className="fine" style={{ marginTop: -4 }}>Use this only for payments made outside the site. Stripe payments are recorded automatically.</p>
        <button className="btn lime" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
        {msg && <p className="mono">{msg}</p>}
      </form>

      <div className="panel">
        <h3>Text the customer</h3>
        <p className="fine">Ready-made message for the selected status:</p>
        <p style={{ background: "var(--paper)", border: "1.5px solid var(--line)", borderRadius: 10, padding: 12, margin: "10px 0", fontSize: ".92rem" }}>{text}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn lime" href={`sms:${order.phone}?&body=${encodeURIComponent(text)}`}>Open in Messages</a>
          <button className="btn" type="button" onClick={() => copy(text)}>Copy text</button>
          <button className="btn" type="button" onClick={() => copy(link)}>Copy order link</button>
        </div>
        <p className="fine">Save your changes first, then send.</p>
      </div>
    </div>
  );
}
