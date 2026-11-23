import { notFound } from "next/navigation";
import Nav, { phoneDisplay } from "../../components/Nav";
import PayButtons from "./PayButtons";
import { getOrder, amountDue, balance } from "@/lib/db";
import { STATUSES } from "@/lib/catalog";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your order · McCray Made", robots: { index: false } };

const FLOW = ["new", "approved", "in_progress", "completed", "paid"];

export default async function OrderPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const o = await getOrder(id);
  if (!o) notFound();
  const st = STATUSES[o.status] || STATUSES.new;
  const due = amountDue(o), left = balance(o);
  const step = FLOW.indexOf(o.status);
  const phone = process.env.NEXT_PUBLIC_PHONE || "";
  const canDeposit = ["approved", "in_progress"].includes(o.status) && o.amount_paid_cents === 0;
  const canPay = ["approved", "in_progress", "completed"].includes(o.status) && left > 0;

  return (
    <>
      <Nav />
      <main className="page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          {sp?.new && (
            <div className="panel" style={{ background: "var(--lime)" }}>
              <h3>Order received! 🎉</h3>
              <p style={{ marginTop: 6 }}><b>Save or bookmark this page</b>. It's where you'll track progress and pay. I'll text you soon to confirm.</p>
            </div>
          )}
          {sp?.paid && (
            <div className="panel" style={{ background: "#b8f0c8" }}>
              <h3>Payment received. Thank you! 🙏</h3>
              <p style={{ marginTop: 6 }}>It may take a moment to show below. Refresh if it hasn't updated.</p>
            </div>
          )}

          <div className="panel">
            <p className="mono muted">Order #{o.id.slice(0, 8).toUpperCase()} · {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            <h2 style={{ fontSize: "2rem", margin: "6px 0 10px" }}>Hi {o.name.split(" ")[0]}, here's your order</h2>
            <span className={"badge " + o.status}>{st.label}</span>
            {o.status !== "cancelled" && (
              <div className="progress" aria-hidden="true">{FLOW.map((s, i) => <div key={s} className={i <= step ? "on" : ""} />)}</div>
            )}
            <p>{st.note}</p>
            {o.customer_note && <p style={{ marginTop: 12, padding: 12, background: "var(--paper)", borderRadius: 10, border: "1.5px solid var(--line)" }}><b>Note from Isaiah:</b> {o.customer_note}</p>}
          </div>

          <div className="panel receipt" style={{ position: "static" }}>
            <h3>RECEIPT</h3>
            <div className="hr" />
            {o.items.map((l) => (
              <div className="rline" key={l.id}><span>{l.qty > 1 ? `${l.qty} × ` : ""}{l.name}{l.from ? "*" : ""}{l.monthly ? " (1st month)" : ""}</span><span>{money(l.amount)}</span></div>
            ))}
            {o.rush && <div className="rline"><span>Rush delivery (+25%)</span><span>incl.</span></div>}
            {o.discount_cents > 0 && <div className="rline disc"><span>{o.promo} discount</span><span>−{money(o.discount_cents)}</span></div>}
            <div className="hr" />
            {o.final_total_cents != null && o.final_total_cents !== o.total_cents && (
              <div className="rline muted"><span>Original estimate</span><span style={{ textDecoration: "line-through" }}>{money(o.total_cents)}</span></div>
            )}
            <div className="total"><span>Total</span><span>{money(due)}</span></div>
            <div className="rline" style={{ marginTop: 8 }}><span>Paid</span><span>{money(o.amount_paid_cents)}</span></div>
            <div className="rline" style={{ fontWeight: 600 }}><span>Balance</span><span>{money(left)}</span></div>
            {o.has_from && o.status === "new" && <p className="fine">* Starting price. Final price confirmed before payment.</p>}
            {o.monthly_cents > 0 && <p className="fine">Monthly plans renew at {money(o.monthly_cents)}/mo after the first month. I'll set up billing with you.</p>}

            {canPay && <PayButtons orderId={o.id} deposit={canDeposit ? Math.round(due / 2) : 0} balance={left} />}
            {o.status === "new" && <p className="fine" style={{ marginTop: 14, textAlign: "center" }}>Payment unlocks once I confirm your order.</p>}
          </div>

          <p className="muted" style={{ marginTop: 18, textAlign: "center" }}>Questions? Text <a href={`sms:+1${phone}`}>{phoneDisplay(phone)}</a></p>
        </div>
      </main>
    </>
  );
}
